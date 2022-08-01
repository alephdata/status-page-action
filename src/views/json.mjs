export default function (messages) {
  return JSON.stringify(messages.map((message) => message.toObject()));
}
