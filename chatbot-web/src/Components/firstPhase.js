export default function firstPhase(addMessages, setMessages, endPhase) {
  setMessages([]);
  let initialMessages = [
    {
      sender: "bot",
      text: "Hola, soy C418 🤖.",
    },
    {
      sender: "bot",
      text:
        "Me crearon para atender las necesidades que puedieras tener acerca de prácticamente cualquier cosa relacionada a UNFPA.",
    },
    {
      sender: "user",
      options: [
        {
          onClick: () =>
            addMessages(
              [
                {
                  sender: "bot",
                  text:
                    "Claro, me crearon en el grupo de Innovación del UNFPA. Todos ellos buscan que pueda incentivar la opinión colectiva de los jóvenes al rededor de la innovación y, a la vez, proteger los derechos de las mujeres, hombres, y niños que lo necesiten.",
                },
                {
                  sender: "user",
                  options: [
                    {
                      onClick: () =>
                        addMessages(
                          [
                            {
                              sender: "bot",
                              text:
                                "Gracias! Antes de empezar debes saber que Esta conversación es confidencial, no recogo ningún dato personal sobre ti.",
                            },
                            {
                              sender: "user",
                              options: [
                                {
                                  onClick: () =>
                                    addMessages(
                                      [
                                        {
                                          sender: "bot",
                                          text:
                                            "Bueno, empecemos por saber tu edad.",
                                        },
                                        {
                                          sender: "bot",
                                          text:
                                            "Te prometo que ya casi terminamos la parte aburrida, pero necesito saber algunas cosas que me permitirán saber más de lo que quieres 🤓",
                                        },
                                        {
                                          sender: "user",
                                          options: [
                                            {
                                              message: {
                                                sender: "user",
                                                text: "soy menor de edad 👼🏻",
                                              },
                                              onClick: () => {
                                                endPhase([0, 18]);
                                              },
                                            },
                                            {
                                              message: {
                                                sender: "user",
                                                text: "soy menor de 25 💁🏻",
                                              },
                                              onClick: () => {
                                                endPhase([18, 25]);
                                              },
                                            },
                                            {
                                              message: {
                                                sender: "user",
                                                text: "soy mayor de 25 👨🏻‍⚖️",
                                              },
                                              onClick: () => {
                                                endPhase([25, 99]);
                                              },
                                            },
                                          ],
                                        },
                                      ],
                                      500
                                    ),
                                  message: {
                                    sender: "user",
                                    text: "Qué bueno saberlo 💖",
                                  },
                                },
                              ],
                            },
                          ],
                          500
                        ),
                      message: {
                        sender: "user",
                        text: "Suena genial!",
                      },
                    },
                  ],
                },
              ],
              500
            ),
          message: {
            sender: "user",
            text: "Okey, cuéntame más! 👀",
          },
        },
      ],
    },
  ];

  addMessages(initialMessages, 50);
}
