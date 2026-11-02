import { BaseNode, NodeMutation, TetheredAnnotation, ReconciliationReport } from '../engine/types';

export interface ReconcileOptions {
  oldRows: Record<string, any>[];
  newRows: Record<string, any>[];
  oldBaseNodes: BaseNode[];
  newBaseNodes: BaseNode[];
  currentMutations: Record<string, NodeMutation>;
  currentAnnotations: TetheredAnnotation[];
  specifiedKey?: string;
}

export interface ReconcileResult {
  reconciledMutations: Record<string, NodeMutation>;
  reconciledAnnotations: TetheredAnnotation[];
  report: ReconciliationReport;
}

export class DatasetReconciler {
  /**
   * Discovers the best matching key column present in both datasets.
   */
  public findCandidateMatchKey(
    oldRows: Record<string, any>[],
    newRows: Record<string, any>[],
    preferredKey?: string
  ): string {
    if (preferredKey && oldRows[0] && preferredKey in oldRows[0] && newRows[0] && preferredKey in newRows[0]) {
      return preferredKey;
    }

    if (!oldRows.length || !newRows.length) return 'id';

    const oldCols = Object.keys(oldRows[0]);
    const newCols = new Set(Object.keys(newRows[0]));
    const sharedCols = oldCols.filter((col) => newCols.has(col));

    const highPriorityKeys = [
      'id',
      '_id',
      'key',
      'code',
      'codigo',
      'iso',
      'iso3',
      'country',
      'pais',
      'name',
      'nombre',
      'entity',
      'entidad',
      'city',
      'ciudad',
      'slug',
      'label',
    ];

    // Check prioritized keys first
    for (const key of highPriorityKeys) {
      const match = sharedCols.find((c) => c.toLowerCase() === key.toLowerCase());
      if (match) {
        return match;
      }
    }

    // Fallback: pick the first shared column that has high uniqueness
    for (const col of sharedCols) {
      const uniqueValues = new Set(oldRows.map((r) => String(r[col]))).size;
      if (uniqueValues >= oldRows.length * 0.8) {
        return col;
      }
    }

    // Default to the first shared column or 'id'
    return sharedCols[0] || 'id';
  }

  /**
   * Reconciles manual mutations and tethered annotations between old and new datasets
   * preserving all Bézier deformations, custom positions, colors, and notes.
   */
  public reconcile(options: ReconcileOptions): ReconcileResult {
    const {
      oldRows,
      newRows,
      oldBaseNodes,
      newBaseNodes,
      currentMutations,
      currentAnnotations,
      specifiedKey,
    } = options;

    const matchKey = this.findCandidateMatchKey(oldRows, newRows, specifiedKey);

    // Map old key values to old node IDs
    const oldKeyToNodeId = new Map<string, string>();
    oldBaseNodes.forEach((node) => {
      const row = oldRows[node.rawIndex];
      const val = row && row[matchKey] !== undefined ? String(row[matchKey]).trim() : node.id;
      oldKeyToNodeId.set(val, node.id);
    });

    const reconciledMutations: Record<string, NodeMutation> = {};
    const matchedOldNodeIds = new Set<string>();
    let matchedCount = 0;
    let newCount = 0;

    // Track mapping from oldNodeId -> newNodeId for annotation re-anchoring
    const oldToNewNodeIdMap = new Map<string, string>();

    newBaseNodes.forEach((newNode) => {
      const newRow = newRows[newNode.rawIndex];
      const newVal = newRow && newRow[matchKey] !== undefined ? String(newRow[matchKey]).trim() : newNode.id;
      const oldNodeId = oldKeyToNodeId.get(newVal);

      if (oldNodeId) {
        matchedOldNodeIds.add(oldNodeId);
        oldToNewNodeIdMap.set(oldNodeId, newNode.id);

        const existingMutation = currentMutations[oldNodeId];
        if (existingMutation) {
          reconciledMutations[newNode.id] = {
            ...existingMutation,
            id: newNode.id,
          };
          matchedCount++;
        }
      } else {
        newCount++;
      }
    });

    // Re-anchor annotations
    const reconciledAnnotations: TetheredAnnotation[] = [];
    currentAnnotations.forEach((ann) => {
      const newNodeId = oldToNewNodeIdMap.get(ann.targetNodeId);
      if (newNodeId) {
        reconciledAnnotations.push({
          ...ann,
          targetNodeId: newNodeId,
        });
      }
    });

    const removedCount = oldBaseNodes.length - matchedOldNodeIds.size;

    const report: ReconciliationReport = {
      timestamp: new Date().toISOString(),
      matchedCount,
      newCount,
      removedCount,
      matchKey,
    };

    return {
      reconciledMutations,
      reconciledAnnotations,
      report,
    };
  }
}

export const datasetReconciler = new DatasetReconciler();
