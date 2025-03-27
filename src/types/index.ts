// Base types for audit data
export type AuditBase = {
  id?: string;
  clientName: string;
  envelopeBranch: string;
  locationFloor: string;
  auditorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export type RoomBase = {
  id?: string;
  auditId: string;
  roomName: string;
  occupancy: number;
  durationPerDay: number;
  daysPerWeek: number;
  remarks: string;
}

// Air Conditioning Equipment
export type AirConditioningEquipment = RoomBase & {
  quantity: number;
  inputPower: number;
  capacityBTU: number;
  capacityWatt: number;
  eer: number; // Energy Efficiency Ratio
  coolingCapacity: number; // in kW
  roomLength: number;
  roomWidth: number;
  roomHeight: number;
  durationPerDay: number;
  daysPerWeek: number;
  remarks?: string;
  acType: string; // Type of air conditioning (Central, Standing, Split, Other)
  otherAcType?: string; // Custom type when acType is "Other"
}

// Form state type for Air Conditioning Equipment
export type AirConditioningFormState = {
  roomName: string;
  occupancy: string;
  durationPerDay: string;
  daysPerWeek: string;
  remarks: string;
  quantity: string;
  inputPower: string;
  capacityBTU: string;
  capacityWatt: string;
  eer: string;
  roomLength: string;
  roomWidth: string;
  roomHeight: string;
  acType: string;
  otherAcType?: string;
}

// Lighting Equipment
export type LightingEquipment = RoomBase & {
  quantity: number;
  power: number;
  roomLength: number;
  roomWidth: number;
  roomHeight: number;
  lampsPerFitting: number;
  lampDescription: string;
  averageLux: number;
}

// Form state type for Lighting Equipment
export type LightingFormState = {
  roomName: string;
  occupancy: string;
  durationPerDay: string;
  daysPerWeek: string;
  remarks: string;
  quantity: string;
  power: string;
  roomLength: string;
  roomWidth: string;
  roomHeight: string;
  lampsPerFitting: string;
  lampDescription: string;
  averageLux: string;
}

// Other Equipment
export type OtherEquipment = RoomBase & {
  equipmentName: string;
  equipmentType: string;
  quantity: number;
  power: number;
}

// Form state type for Other Equipment
export type OtherEquipmentFormState = Omit<OtherEquipment, 'id' | 'auditId'> & {
  quantity: string | number;
  power: string | number;
  occupancy: string | number;
  durationPerDay: string | number;
  daysPerWeek: string | number;
}

// Combined audit data
export type AuditData = {
  audit: AuditBase;
  airConditioning: AirConditioningEquipment[];
  lighting: LightingEquipment[];
  otherEquipment: OtherEquipment[];
}
