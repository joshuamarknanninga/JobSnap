const IntroGate = ({ onEnter, onSkip }) => {
  return (
    <div className="intro-backdrop" role="dialog" aria-modal="true" aria-label="JobSnap intro">
      <div className="intro-card">
        <p className="intro-eyebrow">Welcome</p>
        <h1>Start with a quick JobSnap walkthrough</h1>
        <p>
          In under 60 seconds, you’ll see the core flow: customers → estimates → jobs → invoices.
        </p>
        <div className="intro-actions">
          <button className="btn btn-primary" type="button" onClick={onEnter}>Enter JobSnap</button>
          <button className="btn btn-ghost" type="button" onClick={onSkip}>Skip for now</button>
        </div>
      </div>
    </div>
  );
};

export default IntroGate;
