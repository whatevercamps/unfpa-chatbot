export default function thirdPhase(addMessages, userAge, userGender, endPhase) {
  let initialMessages = [
    {
      sender: "bot",
      text:
        "Oye, ¿y te gustaría que te llame de alguna manera o lo dejamos así?",
    },
    {
      sender: "user",
      options: [
        {
          message: {
            sender: "user",
            text: "See 😎",
          },
          onClick: () =>
            addMessages([
              {
                sender: "bot",
                text:
                  "Genial! Dime, ¿cómo quieres que te llame durante nuestra charla?",
              },
              {
                sender: "user",
                input: {
                  notAllowedToRecord: true,
                  handleSubmit: endPhase,
                  placeholder: "pon aquí tu nombre",
                },
              },
            ]),
        },
        {
          message: {
            sender: "user",
            text: "Nah 😅",
          },
          onClick: () => endPhase(),
        },
      ],
    },
  ];

  addMessages(initialMessages, 50);
}
