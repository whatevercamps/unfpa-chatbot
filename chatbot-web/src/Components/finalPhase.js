export default function finalPhase(
  addMessages,
  userAge,
  userGender,
  userName,
  sendWatsonMessage
) {
  let initialMessages = [
    {
      sender: "bot",
      text: `Ahora si ${userName} ¡empecemos a divertirnos!`,
    },
    {
      sender: "bot",
      text: "Cuéntame, ¿en qué puedo ayudarte?",
    },
    {
      sender: "user",
      input: {
        handleSubmit: sendWatsonMessage,
        placeholder: "puedes contarme lo que sea",
      },
    },
  ];

  addMessages(initialMessages, 50);
}
