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

// Lighting Equipment
export type LightingEquipment = RoomBase & {
  quantity: number;
  power: number;
  roomLength: number;
  roomWidth: number;
  roomHeight: number;
}

// Other Equipment
export type OtherEquipment = RoomBase & {
  equipmentName: string;
  equipmentType: string;
  quantity: number;
  power: number;
}

// Combined audit data
export type AuditData = {
  audit: AuditBase;
  airConditioning: AirConditioningEquipment[];
  lighting: LightingEquipment[];
  otherEquipment: OtherEquipment[];
}
