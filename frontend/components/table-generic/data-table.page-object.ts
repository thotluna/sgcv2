import { screen } from '@testing-library/react';

export class DataTablePageObject {
  /**
   * Verifies that a column header with the specific name exists.
   */
  public expectHeader(name: string) {
    const header = screen.getByRole('columnheader', { name });
    expect(header).toBeInTheDocument();
  }

  /**
   * Verifies the exact number of data rows in the table body.
   * Excludes the header row.
   */
  public expectRowCount(count: number) {
    // Get all rows
    const rows = screen.getAllByRole('row');
    // We expect 1 header row + 'count' data rows.
    // If count is 0, we might only have the header row, or maybe an empty state row depending on implementation.
    // Based on implementation: if data is empty, it renders a specialized div, not a table with 0 rows?
    // Let's check implementation behavior for empty state.
    // Logic: if !data.length -> returns a div, no Table component.
    // So if count > 0, we expect count + 1 rows.
    expect(rows).toHaveLength(count + 1);
  }

  /**
   * Verifies that a specific text appears in the document.
   */
  public expectDataVisible(text: string) {
    expect(screen.getByText(text)).toBeVisible();
  }

  /**
   * Verifies that specific text does NOT appear in the document.
   */
  public expectDataHidden(text: string) {
    expect(screen.queryByText(text)).not.toBeInTheDocument();
  }

  /**
   * Verifies that a specific row (by index) contains the expected text.
   * Row index is 0-based relative to data rows (skipping header).
   */
  public expectRowContent(rowIndex: number, content: string) {
    const rows = screen.getAllByRole('row');
    // skip header (index 0)
    const dataRow = rows[rowIndex + 1];
    expect(dataRow).toHaveTextContent(content);
  }

  /**
   * Verifies the empty state message.
   * Since this renders a simple div and not a table, we search by text.
   */
  public expectEmptyState(message: string) {
    expect(screen.getByText(message)).toBeVisible();
  }

  /**
   * Verifies the error state message.
   */
  public expectErrorMessage(message: string) {
    expect(screen.getByText(message)).toBeVisible();
  }
}
