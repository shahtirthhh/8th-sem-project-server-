exports.error = (error_string: string, where: string): void => {
  console.log(
    `\n\n\n 💀 ERROR OCCURED\n\tloation: ${where}\n\t${error_string}`
  );
  return;
};
