import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";
import { LuSearch, LuMapPin, LuX, LuTruck, LuLocateFixed } from "react-icons/lu";
import "leaflet/dist/leaflet.css";
import useTitle from "../hooks/useTitle";
import { districts } from "../data/districts";

const center = [23.685, 90.356];
const bounds = [
  [20.3, 87.6],
  [26.9, 93.2],
];
const primaryColor = "#c8461a";
const mutedColor = "#6b7280";

const coveredDistricts = districts
  .filter((district) => district.covered)
  .sort((a, b) => a.name.localeCompare(b.name));

const MapController = ({ target, startZoom }) => {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 10, { duration: 1.2 });
    } else {
      map.flyTo(center, startZoom, { duration: 1 });
    }
  }, [map, target, startZoom]);

  return null;
};

const Coverage = () => {
  useTitle("Coverage");
  const [startZoom] = useState(() => (window.innerWidth < 640 ? 6 : 7));
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const keyword = query.trim().toLowerCase();

  const matches = keyword
    ? districts
        .filter(
          (district) =>
            district.name.toLowerCase().includes(keyword) ||
            district.bn.includes(query.trim())
        )
        .slice(0, 6)
    : [];

  const chooseDistrict = (district) => {
    setSelected(district);
    setQuery(district.name);
    setOpen(false);
  };

  const clearSearch = () => {
    setQuery("");
    setSelected(null);
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (matches.length > 0) chooseDistrict(matches[0]);
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
    setOpen(true);
  };

  const mapDistricts =
    selected && !selected.covered ? [...coveredDistricts, selected] : coveredDistricts;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h1 className="text-3xl font-bold text-base-content sm:text-4xl">Our Coverage</h1>
      <p className="mt-2 max-w-2xl text-base text-base-content/85 sm:text-lg">
        Find out where our home chefs deliver. Search your district and the map
        will take you straight to it.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[22rem_1fr]">
        <aside className="space-y-5">
          <div className="rounded-box border border-base-content/20 bg-base-100 p-4 sm:p-5">
            <form onSubmit={handleSubmit} className="relative">
              <label
                htmlFor="district-search"
                className="mb-1.5 block text-[15px] font-semibold text-base-content"
              >
                Search your district
              </label>
              <label className="input h-12 w-full gap-2 border-base-content/30 text-base focus-within:border-primary">
                <LuSearch size={20} className="shrink-0 text-base-content/70" />
                <input
                  id="district-search"
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. Sylhet"
                  value={query}
                  onChange={handleChange}
                  onFocus={() => setOpen(true)}
                  className="grow placeholder:text-base-content/50"
                />
                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="shrink-0 text-base-content/70 hover:text-primary"
                  >
                    <LuX size={20} />
                  </button>
                )}
              </label>

              {open && keyword && (
                <ul className="absolute left-0 right-0 z-[1100] mt-1 max-h-64 overflow-y-auto rounded-box border border-base-content/20 bg-base-100 p-1 shadow-lg">
                  {matches.length === 0 ? (
                    <li className="px-3 py-2.5 text-[15px] text-base-content/80">
                      No district found
                    </li>
                  ) : (
                    matches.map((district) => (
                      <li key={district.name}>
                        <button
                          type="button"
                          onClick={() => chooseDistrict(district)}
                          className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-[15px] font-medium text-base-content hover:bg-base-200"
                        >
                          <span>
                            {district.name}{" "}
                            <span className="font-normal text-base-content/70">
                              {district.bn}
                            </span>
                          </span>
                          <span
                            className={`text-sm font-semibold ${
                              district.covered ? "text-success" : "text-base-content/60"
                            }`}
                          >
                            {district.covered ? "Covered" : "Not yet"}
                          </span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </form>

            {selected && (
              <div
                className={`mt-4 rounded-lg border p-4 ${
                  selected.covered
                    ? "border-success/40 bg-success/10"
                    : "border-base-content/20 bg-base-200"
                }`}
              >
                <p className="text-lg font-bold text-base-content">
                  {selected.name}{" "}
                  <span className="font-normal text-base-content/80">{selected.bn}</span>
                </p>
                <p className="mt-0.5 text-[15px] text-base-content/80">
                  {selected.division} Division
                </p>
                <p className="mt-2 flex items-center gap-2 text-[15px] font-semibold text-base-content">
                  <LuTruck size={18} className="shrink-0" />
                  {selected.covered
                    ? "Home chefs deliver here"
                    : "We do not deliver here yet"}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-box border border-base-content/20 bg-base-100 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-base-content">Covered districts</h2>
              <span className="badge badge-primary">{coveredDistricts.length}</span>
            </div>
            <ul className="mt-3 grid max-h-64 gap-1 overflow-y-auto sm:grid-cols-2 lg:grid-cols-1">
              {coveredDistricts.map((district) => (
                <li key={district.name}>
                  <button
                    type="button"
                    onClick={() => chooseDistrict(district)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[15px] font-medium transition-colors ${
                      selected?.name === district.name
                        ? "bg-primary text-primary-content"
                        : "text-base-content hover:bg-base-200"
                    }`}
                  >
                    <LuMapPin size={18} className="shrink-0" />
                    {district.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="relative isolate overflow-hidden rounded-box border border-base-content/20 bg-base-100">
          <MapContainer
            center={center}
            zoom={startZoom}
            minZoom={5}
            zoomSnap={0.5}
            maxBounds={bounds}
            maxBoundsViscosity={0.8}
            className="h-[420px] w-full sm:h-[560px] lg:h-[660px]"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController target={selected} startZoom={startZoom} />

            {mapDistricts.map((district) => {
              const isSelected = selected?.name === district.name;

              return (
                <CircleMarker
                  key={`${district.name}-${isSelected}`}
                  center={[district.lat, district.lng]}
                  radius={isSelected ? 14 : 8}
                  pathOptions={{
                    color: "#ffffff",
                    weight: isSelected ? 3 : 2,
                    fillColor: district.covered ? primaryColor : mutedColor,
                    fillOpacity: isSelected ? 0.95 : 0.85,
                  }}
                  eventHandlers={{ click: () => chooseDistrict(district) }}
                >
                  <Tooltip direction="top" offset={[0, -8]} permanent={isSelected}>
                    <strong>{district.name}</strong>
                    <br />
                    {district.covered ? "Delivery available" : "Not covered yet"}
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>

          {selected && (
            <button
              type="button"
              onClick={clearSearch}
              className="btn btn-sm absolute right-3 top-3 z-[1000] gap-1 border-base-content/30 bg-base-100 text-[15px] shadow"
            >
              <LuLocateFixed size={16} />
              Show all
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Coverage;