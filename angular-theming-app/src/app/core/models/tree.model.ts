export interface TreeNode<T = any> {
  id: string; // Unique identifier for selection
  label: string; // Text to display
  icon?: string; // Optional Material icon
  children?: TreeNode<T>[]; // Nested nodes
  data?: T; // Generic payload (e.g., the article content!)
}
