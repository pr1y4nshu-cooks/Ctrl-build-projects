// Form validation helpers

export function validateIssueForm(title, description) {
  const errors = {};
  if (!title.trim()) errors.title = 'Issue title is required';
  if (!description.trim()) errors.description = 'Issue description is required';
  if (title.trim().length < 10) errors.title = 'Title must be at least 10 characters';
  if (description.trim().length < 20) errors.description = 'Description must be at least 20 characters';
  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
