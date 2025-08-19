export const editSteps = [
  {
    key: "name",
    title: "Name & Scientic Name",
    instructions: [
      "Enter the name of the plant.",
      "Enter the scientific name of the plant.",
    ],
    placeholder: "Enter the name of this plant...",
  },
  {
    key: "visuals",
    title: "Picture & Common Name",
    instructions: [
      "Tap the image area to upload or change the picture of the plant.",
      "Enter the common name of the plant in the input field.",
      "Start each line with '-' to create a bullet point.",
      "Use **double asterisks** to make text bold within a bullet.",

    ],
    placeholder: "Enter the common name of this plant...",
  },
  {
    key: "info",
    title: "Plant Information",
    instructions: [
      "Wrap text with *single asterisk* to make it *italic*.",
      "Wrap text with **double asterisks** to make it **bold**.",
      "Wrap text with ***triple asterisks*** to make it ***bold and italic***.",
    ],
    placeholder: "Enter basic information about this plant...",
  },
  {
    key: "usage",
    title: "How to Use the Medicinal Plant",
    instructions: [
      'Start each line with "- " to create a bullet point.',
      "Use **double asterisks** to make text bold within a bullet.",
    ],
    placeholder: "Describe how this plant is used medicinally...",
  },
  {
    key: "location",
    title: "Medicinal Plant Location",
    instructions: [
      "Tap the map to add a marker.",
      "Tap an existing marker to remove it.",
    ],
    placeholder: "",
  },
];

export const data = {
    editSteps,
};
