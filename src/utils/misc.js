export const downloadFile = (data, type, name) => {
  // Create a blob from the data (assuming Supabase returns CSV as a string)
  const blob = new Blob([data], { type });

  // Create a link element
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);

  // Set the download attribute (file name)
  link.download = name;

  // Append the link to the document body and trigger a click
  document.body.appendChild(link);
  link.click();

  // Clean up and remove the link
  document.body.removeChild(link);
}

export const toCSV = (data) => {
  const array = [Object.keys(data[0])].concat(data);

  return array.map(row => {
    return Object.values(row).map(value => {
      // Handle commas inside fields by enclosing the value in quotes
      const escapedValue = (typeof value === 'string') ? `"${value.replace(/"/g, '""')}"` : value;
      return escapedValue;
    }).join(',');
  }).join('\n');
}