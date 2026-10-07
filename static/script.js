const loader = document.getElementById("loader");

function scanLeaf() {
  const input = document.getElementById("imageInput");
  const file = input.files[0];

  if (!file) {
    alert("Please capture a leaf image");
    return;
  }

  // SHOW IMAGE PREVIEW
  const previewContainer = document.getElementById("previewContainer");
  const previewImage = document.getElementById("previewImage");

  previewImage.src = URL.createObjectURL(file);
  previewContainer.classList.remove("hidden");

  // Show loader & hide old result
  loader.classList.remove("hidden");
  document.getElementById("result").classList.add("hidden");

  const formData = new FormData();
  formData.append("image", file);

  //change the URL to your backend endpoint
   fetch("http://192.168.1.5:5000/predict", //your ipv4 address
   {
     method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      loader.classList.add("hidden");

      if (!data.success) {
        alert(data.message || "Prediction failed");
        return;
      }

      showResult(data);
    })
    .catch(err => {
      loader.classList.add("hidden");
      alert("Server error");
    });
}


function showResult(data) {
  document.getElementById("result").classList.remove("hidden");

  document.getElementById("plantName").innerText =
    "🌱 " + data.prediction.label.toUpperCase();

  document.getElementById("confidence").innerText =
    "Recognized with " + (data.prediction.confidence * 100).toFixed(1) + "% clarity";


  document.getElementById("scientificName").innerText =
    data.plant_info.scientific_name;

  document.getElementById("rasa").innerText =
    data.plant_info.ayurvedic_profile.rasa.join(", ");

  document.getElementById("guna").innerText =
    data.plant_info.ayurvedic_profile.guna.join(", ");

  document.getElementById("virya").innerText =
    data.plant_info.ayurvedic_profile.virya;

  document.getElementById("vipaka").innerText =
    data.plant_info.ayurvedic_profile.vipaka;

  const usesList = document.getElementById("uses");
  usesList.innerHTML = "";

  data.plant_info.medicinal_uses.forEach(use => {
    const li = document.createElement("li");
    li.innerText = use;
    usesList.appendChild(li);
  });
  const facts = {
    banana: "In Ayurveda, Banana is grounding and nourishing. It calms Vata and Pitta, strengthens tissues, and supports digestive fire when taken mindfully.",
    tulsi: "Tulsi is called the ‘Queen of Herbs’. It purifies the breath, clears the mind, and is believed to protect the aura.",
    aloevera: "Aloe Vera is revered for cooling excess heat. It supports liver health, skin healing, and inner balance.",
    neem: "Neem is known as ‘Sarva Roga Nivarini’ — the curer of all ailments. It cleanses blood and purifies the body deeply.",
    gauava: "Guava is valued for its astringent nature. It strengthens digestion, supports gut health, and helps balance excess Kapha and Pitta.",
    rose: "Rose is known for its calming and cooling properties. It soothes the heart, balances emotions, and reduces excess heat in the body."
  };

  const label = data.prediction.label.toLowerCase();
  document.getElementById("ayurvedaFact").innerText =
    facts[label] ||
    "Ayurveda teaches that every plant carries prana — life energy — supporting harmony between body, mind, and nature.";

}
