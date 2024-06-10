export function formatTimestamp(timestamp) {
  // Parse the timestamp
  const date = new Date(timestamp);

  // Format the date
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = date.toLocaleString("default", { month: "short" });
  const year = String(date.getUTCFullYear()).slice(-2);

  // Format the time
  // const hours = String(date.getUTCHours()).padStart(2, "0");
  // let minutes = String(date.getUTCMinutes()).padStart(2, "0");

  // Manually override the minutes part to '67'
  // minutes = '67';

  // Construct the final string with the desired format
  const formattedDate = `${day} ${month} ${year}`;
  //const formattedTime = `${hours}:${minutes}`;
  const finalOutput = `${formattedDate}`;

  return finalOutput;
}
