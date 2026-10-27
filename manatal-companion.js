(() => {
  // Hotfix for the already-published SurfJobs Pages bundle. The canonical
  // source implementation lives in polarx0/surfjobs-source/src/ui.ts.
  function isManatalJob(raw) {
    try {
      const url = new URL(raw);
      const host = url.hostname.toLowerCase();
      return url.protocol === "https:" &&
        (host === "careers-page.com" || host.endsWith(".careers-page.com")) &&
        /^\/[^/]+\/job\/[^/]+(?:\/apply)?\/?$/i.test(url.pathname);
    } catch (_) {
      return false;
    }
  }

  document.addEventListener("click", async (event) => {
    if (!event.target?.closest?.("#continueApplication")) return;
    const jobUrl = String(document.getElementById("jobUrl")?.value || "").trim();
    if (!isManatalJob(jobUrl)) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    const button = document.getElementById("continueApplication");
    const review = document.getElementById("review");
    const error = document.getElementById("topError");
    const fields = [
      "firstName", "lastName", "email", "country", "phone", "location",
      "linkedin", "github", "workAuthorization", "sponsorshipRequired",
      "englishProficiency", "salaryCurrency", "salaryExpectation", "resumePath"
    ];
    const profile = {};
    for (const key of fields) {
      const value = String(document.getElementById(key)?.value || "").trim();
      if (value) profile[key] = value;
    }
    if (!profile.firstName || !profile.lastName || !profile.email) {
      if (error) error.textContent = "First name, last name and email are required.";
      return;
    }

    // Opening during the actual click avoids popup blockers.
    const popup = window.open("about:blank", "_blank");
    if (button) {
      button.disabled = true;
      button.textContent = "Opening Manatal…";
    }
    if (error) error.textContent = "";
    try {
      const response = await fetch("/companion/profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ profile, applicationUrl: jobUrl })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || payload.error || "SurfJobs Companion unavailable");
      if (popup) popup.location.href = jobUrl;
      if (review) {
        review.textContent = "Manatal application opened. On the application page, click Fill with SurfJobs, check the resume and submit manually.";
        if (!popup) {
          const link = document.createElement("a");
          link.href = jobUrl;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.textContent = " Open the application";
          review.appendChild(link);
        }
      }
    } catch (failure) {
      if (popup) popup.close();
      if (error) error.textContent = "Could not prepare Manatal Companion: " + String(failure?.message || failure);
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = "Save & Open Application";
      }
    }
  }, true);
})();