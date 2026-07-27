class MulungushiLiveClass extends HTMLElement {
  connectedCallback() {
    this.isLive = false;
    this.jitsiApi = null;
    this.render();
  }

  render() {
    this.innerHTML = `
      <style>
        .live-wrap {
          width: 100%;
          border-radius: 10px;
          overflow: hidden;
          background: #f4f6f9;
          font-family: 'Segoe UI', Arial, sans-serif;
        }
        .join-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
          color: white;
          border-radius: 10px;
          background: linear-gradient(135deg, #08325D, #0C447C);
        }
        .join-screen h2 { margin: 0 0 8px 0; font-size: 22px; }
        .join-screen p { margin: 0 0 22px 0; font-size: 14px; opacity: 0.9; }
        .status-badge {
          display: inline-block;
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 14px;
          background: rgba(255,255,255,0.15);
          color: #e5e7eb;
        }
        .status-badge.live { background: #D4AF37; color: #08325D; }
        .join-btn {
          border: none;
          padding: 14px 32px;
          font-size: 16px;
          font-weight: 700;
          border-radius: 30px;
          background: rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.6);
          cursor: not-allowed;
        }
        .join-btn.live {
          background: #D4AF37;
          color: #08325D;
          cursor: pointer;
        }
        .name-input {
          margin-bottom: 16px;
          padding: 10px 14px;
          border-radius: 20px;
          border: none;
          width: 240px;
          max-width: 80%;
          font-size: 14px;
          text-align: center;
        }
        #callContainer {
          width: 100%;
          height: 600px;
          display: none;
        }
      </style>
      <div class="live-wrap">
        <div class="join-screen" id="joinScreen">
          <span class="status-badge" id="statusBadge">● LECTURERS OFFLINE</span>
          <h2>🎓 Mulungushi Live Class</h2>
          <p id="statusText">No live class right now — check back once your lecturer starts one.</p>
          <input type="text" id="nameInput" class="name-input" placeholder="Enter your name" />
          <br>
          <button class="join-btn" id="joinBtn" disabled>Join Live Session</button>
        </div>
        <div id="callContainer"></div>
      </div>
    `;

    this.querySelector("#joinBtn").addEventListener("click", () => {
      if (!this.isLive) return;
      this.startCall();
    });
  }

  startCall() {
    const displayName = this.querySelector("#nameInput").value.trim() || "Guest";
    const todayKey = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const roomName = "MulungushiCentralUniversityCollegeLiveClass-" + todayKey;

    this.querySelector("#joinScreen").style.display = "none";
    const container = this.querySelector("#callContainer");
    container.style.display = "block";

    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.onload = () => {
      this.jitsiApi = new window.JitsiMeetExternalAPI("meet.jit.si", {
        roomName: roomName,
        width: "100%",
        height: "100%",
        parentNode: container,
        userInfo: { displayName: displayName },
        configOverwrite: { prejoinPageEnabled: false, disableDeepLinking: true },
        interfaceConfigOverwrite: { SHOW_JITSI_WATERMARK: false, SHOW_WATERMARK_FOR_GUESTS: false }
      });
    };
    document.body.appendChild(script);
  }

  // Called externally by Wix page code: element.setLiveStatus(true/false)
  setLiveStatus(isLive) {
    this.isLive = isLive;
    const badge = this.querySelector("#statusBadge");
    const btn = this.querySelector("#joinBtn");
    const statusText = this.querySelector("#statusText");

    if (isLive) {
      badge.classList.add("live");
      badge.textContent = "● LIVE NOW";
      btn.classList.add("live");
      btn.disabled = false;
      statusText.textContent = "Join today's live session with your lecturer and classmates.";
    } else {
      badge.classList.remove("live");
      badge.textContent = "● LECTURERS OFFLINE";
      btn.classList.remove("live");
      btn.disabled = true;
      statusText.textContent = "No live class right now — check back once your lecturer starts one.";
    }
  }
}

customElements.define("mulungushi-live-class", MulungushiLiveClass);
