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
}

// Form state type for Air Conditioning Equipment
export type AirConditioningFormState = Omit<AirConditioningEquipment, 'id' | 'auditId'> & {
  quantity: string | number;
  inputPower: string | number;
  capacityBTU: string | number;
  capacityWatt: string | number;
  eer: string | number;
  roomLength: string | number;
  roomWidth: string | number;
  roomHeight: string | number;
  durationPerDay: string | number;
  daysPerWeek: string | number;
  occupancy: string | number;
}

// Lighting Equipment
export type LightingEquipment = RoomBase & {
  quantity: number;
  power: number;
  roomLength: number;
  roomWidth: number;
  roomHeight: number;
}

// Form state type for Lighting Equipment
export type LightingFormState = Omit<LightingEquipment, 'id' | 'auditId'> & {
  quantity: string | number;
  power: string | number;
  roomLength: string | number;
  roomWidth: string | number;
  roomHeight: string | number;
  occupancy: string | number;
  durationPerDay: string | number;
  daysPerWeek: string | number;
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
