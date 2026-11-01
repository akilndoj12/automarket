// Listat e opsioneve që përdoren në filtra dhe në formularin e adminit
export const FUELS = ["Naftë", "Benzinë", "Hibrid", "Elektrike", "Benzinë/Gaz"];
export const TRANSMISSIONS = ["Manuale", "Automatike"];
export const DRIVES = ["2WD", "4WD", "AWD"];
export const BODY_TYPES = [
  "SUV",
  "Sedan",
  "Hatchback",
  "Station Wagon",
  "Coupe",
  "Kabriolet",
  "Minivan",
  "Pickup",
  "Furgon",
];
export const CONDITIONS = ["Shumë e mirë", "E mirë", "Mesatare", "Për riparim"];

export const COMMON_FEATURES = [
  "Kondicioner automatik",
  "Navigacion",
  "Kamera parkimi",
  "Sensorë parkimi",
  "Sedilje me lëkurë",
  "Sedilje me ngrohje",
  "Panoramë",
  "Cruise control",
  "Apple CarPlay / Android Auto",
  "Drita LED",
  "Keyless",
  "Bluetooth",
];

export const SORTS: { value: string; label: string }[] = [
  { value: "newest", label: "Më të rejat" },
  { value: "price_asc", label: "Çmimi: më i ulët" },
  { value: "price_desc", label: "Çmimi: më i lartë" },
  { value: "year_desc", label: "Viti: më i ri" },
  { value: "km_asc", label: "Kilometrat: më pak" },
];

export const STATUS_LABEL: Record<string, string> = {
  active: "Aktive",
  reserved: "Rezervuar",
  sold: "Shitur",
};
