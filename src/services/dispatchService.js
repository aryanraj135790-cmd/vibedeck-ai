// Builds aggregated recipient responses and routes them to WhatsApp / Telegram / SMS.
import { soundService } from "./soundService";

function stripPhoneDigits(phoneNum) {
  return String(phoneNum || "").replace(/[^0-9]/g, "");
}

/**
 * Composes a formatted text summary of a recipient's answers.
 * @param {Object} opts - { senderName, recipientName, responses, customNotes, recordedAudio, savedUrl }
 * @returns {string} The formatted message body.
 */
export function buildResponseSummary(opts) {
  const {
    senderName = "",
    recipientName = "",
    responses = {},
    customNotes = "",
    recordedAudio = false,
  } = opts;

  let text = `Hey ${senderName}! I just opened your 3D card deck "${recipientName}"! 💕\n\nHere are my interactive answers:\n`;

  Object.entries(responses).forEach(([q, a], idx) => {
    text += `\n${idx + 1}. ${q}\n👉 ${a}`;
  });

  if (customNotes) {
    text += `\n\n💬 Note: ${customNotes}`;
  }
  if (recordedAudio) {
    text += "\n\n🎙️ [Simulated Voice Note Recorded & Attached]";
  }

  text += "\n\nSent via JoyCraft Cyber Deck ✨";
  return text;
}

/**
 * Routes the response summary to the requested channel by opening a deep link.
 * @param {string} method - "whatsapp" | "telegram" | "sms"
 * @param {Object} opts - { phoneNum, savedUrl, ...buildResponseSummary fields }
 */
export function dispatchResponse(method, opts) {
  soundService.playCyberBeep();

  const textSummary = buildResponseSummary(opts);
  const cleanNum = stripPhoneDigits(opts.phoneNum);

  if (method === "whatsapp") {
    const waUrl = cleanNum
      ? `https://wa.me/${cleanNum}?text=${encodeURIComponent(textSummary)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(textSummary)}`;
    window.open(waUrl, "_blank");
  } else if (method === "telegram") {
    const tgUrl =
      `https://t.me/share/url?url=${encodeURIComponent(opts.savedUrl || window.location.href)}` +
      `&text=${encodeURIComponent(textSummary)}`;
    window.open(tgUrl, "_blank");
  } else if (method === "sms") {
    const smsUrl = cleanNum
      ? `sms:${cleanNum}?body=${encodeURIComponent(textSummary)}`
      : `sms:?body=${encodeURIComponent(textSummary)}`;
    window.open(smsUrl, "_self");
  }
}
