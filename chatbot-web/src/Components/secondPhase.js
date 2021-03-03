export default function secondPhase(addMessages, userAge, endPhase) {
  let initialMessages = [
    {
      sender: "bot",
      text: userAge[1] <= 18 ? "Ah, eres bastante joven... genial!" : "Genial!",
    },
    {
      sender: "bot",
      text: "🤓 sigamos! ",
    },
    {
      sender: "bot",
      text:
        "Obviamente todos somos únicos 💖... pero en este caso necesito saber si te consideras hombre, mujer, o de otro género...",
    },
    {
      sender: "user",
      options: [
        {
          message: {
            sender: "user",
            text: "hombre 🧝🏼",
          },
          onClick: () => endPhase("hombre"),
        },
        {
          message: {
            sender: "user",
            text: "mujer 🧝🏻‍♀️",
          },
          onClick: () => endPhase("mujer"),
        },
        {
          message: {
            sender: "user",
            text: "nah, las etiquetas no son lo mío 🧝🏻‍♂️",
          },
          onClick: () => endPhase("otro"),
        },
      ],
    },
  ];

  addMessages(initialMessages, 50);
}
