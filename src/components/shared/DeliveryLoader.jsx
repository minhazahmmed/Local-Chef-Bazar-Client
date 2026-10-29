const DeliveryLoader = ({ label = "Loading..." }) => {
  return (
    <div role="status" className="flex flex-col items-center gap-3">
      <div className="relative h-14 w-64 overflow-hidden">
        <div className="van-drive absolute -bottom-0.75 left-0">
          <div className="van-bounce">
            <svg width="72" height="40" viewBox="0 0 72 40" aria-hidden="true">
              <rect x="2" y="6" width="40" height="22" rx="3" className="fill-primary" />
              <path
                d="M12 21a8 8 0 0 1 16 0z"
                className="fill-base-100"
              />
              <rect x="10" y="22" width="20" height="2" rx="1" className="fill-base-100" />
              <path
                d="M42 12h13l9 9v7H42z"
                className="fill-primary"
              />
              <path
                d="M46 15h7l5 6H46z"
                className="fill-base-100"
              />
              <g className="wheel-spin" style={{ transformOrigin: "16px 30px" }}>
                <circle cx="16" cy="30" r="6" className="fill-base-content" />
                <circle cx="16" cy="30" r="2" className="fill-base-100" />
                <rect x="15.2" y="24.5" width="1.6" height="4" className="fill-base-100" />
              </g>
              <g className="wheel-spin" style={{ transformOrigin: "52px 30px" }}>
                <circle cx="52" cy="30" r="6" className="fill-base-content" />
                <circle cx="52" cy="30" r="2" className="fill-base-100" />
                <rect x="51.2" y="24.5" width="1.6" height="4" className="fill-base-100" />
              </g>
            </svg>
          </div>
        </div>
        <div className="road absolute bottom-0 left-0 h-0.5 w-full" />
      </div>
      <p className="text-sm text-base-content/60">{label}</p>
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default DeliveryLoader;