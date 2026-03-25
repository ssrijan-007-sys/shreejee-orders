import { db, ref, onValue, get } from "../../firebase/firebase-config.js";

const authUser = JSON.parse(localStorage.getItem("authUser"));
if (!authUser) throw new Error("No auth");

const emailKey = authUser.email.replace(/[.@]/g, "_");

const lastStatus = {};
const alertShownForUpdate = {};

let warningAudio = null;

/* ================= GLOBAL OFD WATCHER ================= */

console.log("OFD Alert Engine Loaded");

onValue(ref(db, `Telecallers/${emailKey}/OFD`), snap => {

  const ofd = snap.val() || {};
  console.log("OFD List:", ofd);

  Object.keys(ofd).forEach(awb => {

    console.log("Watching AWB:", awb);

    onValue(ref(db, `Tracking/${awb}`), async trackSnap => {

      const tracking = trackSnap.val();
      if (!tracking) {
        console.log("No tracking data yet for", awb);
        return;
      }

      const status = tracking.status;
      const prev = lastStatus[awb];

      console.log("Tracking update:", {
        awb,
        prevStatus: prev,
        currentStatus: status,
        updatedAt: tracking.updatedAt
      });

      const instruction =
        tracking?.scans?.slice(-1)[0]?.ScanDetail?.Instructions?.toLowerCase() || "";

      console.log("Instruction:", instruction);

      /* ===== DETECT FAILED DELIVERY ===== */

      if (
        prev === "OUT FOR DELIVERY" &&
        status === "PICKED"
      ) {

        console.log("🚨 OFD FAILURE DETECTED", awb);

        const updateKey = tracking.updatedAt;

        if (alertShownForUpdate[awb] === updateKey) {
          console.log("Already shown alert for this update");
          return;
        }

        alertShownForUpdate[awb] = updateKey;

        showFailureModal(awb, tracking);
      }

      lastStatus[awb] = status;

    });

  });

});

/* ================= MODAL ================= */

async function showFailureModal(awb, tracking) {

  const order = await findOrder(awb);
  if (!order) return;

  const instruction =
    tracking?.scans?.slice(-1)[0]?.ScanDetail?.Instructions ||
    "Delivery attempt failed";

  if (document.getElementById("ofdWarningModal")) return;

  const modal = document.createElement("div");
  modal.id = "ofdWarningModal";
  modal.className =
    "fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]";

  modal.innerHTML = `
    <div class="bg-white text-black w-full max-w-lg p-6 rounded relative">

      <button id="closeWarning"
        class="absolute right-3 top-2 text-xl text-red-600 font-bold">✕</button>

      <h2 class="text-xl font-bold text-red-600 mb-4">
        ⚠ Delivery Attempt Failed
      </h2>

      <div><b>Name:</b> ${order.name}</div>
      <div><b>Phone:</b> ${order.phone}</div>
      <div><b>Order ID:</b> ${order.orderId}</div>
      <div><b>AWB:</b> ${awb}</div>

      <div class="mt-4 bg-red-100 p-3 rounded">
        <b>Last Instruction:</b><br>${instruction}
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  /* ===== SOUND ===== */
  /* ===== SOUND with autoplay fallback ===== */
const audioUrlsToTry = [
  "/assets/ofd-warning.mp3",            // absolute - safest if your server serves /assets
  "../assets/ofd-warning.mp3",         // try relative
  "../../assets/ofd-warning.mp3"       // fallback (module relative is tricky)
];

let audioUrl = audioUrlsToTry.find(url => url); // just choose first for now
// you can change to the correct path if you know it exactly

warningAudio = new Audio(audioUrl);
warningAudio.loop = true;

// try to play; if blocked, show an enable-sound button in the modal
warningAudio.play()
  .then(() => {
    console.log("Warning audio playing");
  })
  .catch((err) => {
    console.warn("Autoplay blocked or audio failed:", err);

    // create a small enable-sound button inside modal
    const btn = document.createElement("button");
    btn.textContent = "🔊 Enable sound";
    btn.className = "mt-4 bg-blue-600 text-white px-3 py-1 rounded";
    // append to modal's content box (modal is the element returned in showFailureModal)
    const modalBox = document.querySelector("#ofdWarningModal > div") || document.body;
    modalBox.appendChild(btn);

    btn.onclick = async () => {
      try {
        await warningAudio.play();
        btn.remove(); // remove button after success
      } catch (e) {
        alert("Unable to play sound. Please check browser autoplay settings or click anywhere on the page first.");
        console.error(e);
      }
    };
  });

  modal.querySelector("#closeWarning").onclick = () => {
    warningAudio.pause();
    warningAudio.currentTime = 0;
    modal.remove();
  };
}

/* ================= FIND ORDER ================= */

async function findOrder(awb) {
  const snap = await get(ref(db, "Telecallers"));
  const data = snap.val() || {};

  for (const tc of Object.values(data)) {
    const orders = tc.Orders || {};

    for (const phone of Object.keys(orders)) {
      for (const id of Object.keys(orders[phone])) {
        const o = orders[phone][id];
        if (o.awb === awb) return o;
      }
    }
  }
}
