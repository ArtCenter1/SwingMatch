# Sprint Tasks: High-Fidelity Clickable Prototype

**Goal:** Create a high-fidelity, clickable prototype for the core user flow (Video Capture → AI Analysis → Simulation) using the final, approved design system. The prototype will be used for user testing and stakeholder validation before functional development begins.

---

### **Phase 1: Foundation & Components**

*   **Task 1: Setup Prototype Navigation**
    *   [ ] Create a dedicated navigation stack or route group for the prototype flow to keep it isolated from the main application.
    *   [ ] Define the routes for each screen in the flow: `capture`, `analyzing`, `results`, `simulation`, `error`.

*   **Task 2: Verify & Enhance UI Component Library**
    *   [ ] **Button:** Confirm `Button.tsx` supports all required states (primary, secondary, disabled, icon-only for camera controls).
    *   [ ] **Card:** Create a more advanced, expandable `Card` component for the results screen, capable of showing a summary and a detailed view.
    *   [ ] **Video Player:** Create a reusable, non-functional video player component with mock controls (play/pause, scrub bar).
    *   [ ] **AR Framing Guide:** Create a static SVG overlay component for the capture screen.
    *   [ ] **Loading Indicator:** Create a reusable loading/spinner component.
    *   [ ] **Slider:** Create a `Slider` component for the "Pro Likeness" control.
    *   [ ] **Theme & Tokens:** Ensure all new and existing components correctly consume values from the `theme/` directory.

---

### **Phase 2: Screen Implementation (Static)**

*   **Task 3: Build Video Capture Screen**
    *   [ ] Develop the static layout for the video capture screen.
    *   [ ] Place the placeholder video player component.
    *   [ ] Overlay the AR Framing Guide.
    *   [ ] Add UI for camera controls (Record, Flip Camera, Flash, Select from Library).

*   **Task 4: Build Analysis Screen**
    *   [ ] Develop the layout for the "Analysis in Progress" screen.
    *   [ ] Integrate the loading indicator and descriptive text.

*   **Task 5: Build Analysis Results Screen**
    *   [ ] Develop the layout for the analysis results.
    *   [ ] Use the new expandable `Card` component to display mock feedback points (e.g., "Wrist Angle," "Racket Head Speed"). Each card should be clickable to show more detail.
    *   [ ] Add a primary CTA button: "View Simulation".

*   **Task 6: Build Simulation Screen**
    *   [ ] Develop the layout for the simulation comparison.
    *   [ ] Place two instances of the video player component side-by-side ("Your Swing" vs. "Simulated Ideal") with playback controls.
    *   [ ] Add the `Slider` component for the "Pro Likeness" control.
    *   [ ] Add a "Share" button.

*   **Task 7: Build Error State Screen**
    *   [ ] Create a generic error screen that can be used for different failure scenarios (e.g., "Analysis Failed").
    *   [ ] Include an illustration, error message, and a "Try Again" button.

---

### **Phase 3: Interactivity & Finalization**

*   **Task 8: Implement Clickable Navigation**
    *   [ ] Wire the "Record" button to navigate to the Analysis Screen.
    *   [ ] After a 2-3 second delay, automatically navigate from the Analysis Screen to the Results Screen. (For testing, create a path to the Error Screen as well).
    *   [ ] Wire the "View Simulation" button to navigate to the Simulation Screen.
    *   [ ] Make the result cards expandable/collapsible.
    *   [ ] Implement a "Start Over" or back button to return to the beginning of the flow.

*   **Task 9: Final Review & Polish**
    *   [ ] Conduct a full, end-to-end click-through of all prototype paths, including the error state.
    *   [ ] Verify that every screen and component correctly implements the design system.
    *   [ ] Ensure the flow is intuitive and matches the UX spec.
    *   [ ] Get final sign-off from the design/product lead.
