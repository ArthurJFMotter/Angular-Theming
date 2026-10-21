import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { TreeNode } from '../../../core/models/tree.model';

@Component({
  selector: 'app-dynamic-tree',
  standalone: true,
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
  ],
  templateUrl: './dynamic-tree.component.html',
  styleUrl: './dynamic-tree.component.scss',
})
export class DynamicTreeComponent {
  @Input({ required: true }) data: TreeNode[] = [];
  @Output() nodeSelected = new EventEmitter<TreeNode>();

  readonly activeNodeId = signal<string | null>(null);

  readonly childrenAccessor = (node: TreeNode): TreeNode[] =>
    node.children ?? [];
  readonly hasChild = (_: number, node: TreeNode) =>
    !!node.children && node.children.length > 0;

  selectNode(node: TreeNode) {
    this.activeNodeId.set(node.id);
    this.nodeSelected.emit(node);
  }
}
