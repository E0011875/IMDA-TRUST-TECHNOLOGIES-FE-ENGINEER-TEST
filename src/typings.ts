export enum THREAT_TYPE {
  TOOL = 'tool',
  REPORT = 'report',
  MALWARE = 'malware',
  IDENTITY = 'identity',
  INDICATOR = 'indicator',
  THREAT_ACTOR = 'threat-actor',
  RELATIONSHIP = 'relationship',
  INTRUSION_SET = 'intrusion-set',
  ATTACK_PATTERN = 'attack-pattern',
}
export type Phase = {
  kill_chain_name: string;
  phase_name: string;
};
export interface Threat extends Record<string, any> {
  id: string;
  type?: THREAT_TYPE;
  name?: string;
  description?: string;
  kill_chain_phases?: Phase[];
}
