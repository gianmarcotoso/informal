export type ExternalAddress = {
	line1: string
	line2: string | null
	city: string
	country: string
	address_field_00: string
	address_field_01: number
	address_field_02: boolean
	address_field_03: string | null
	address_field_04: number | null
	address_field_05: 'automatic' | 'manual'
	address_field_06: Record<string, string>
	address_field_07: string
	address_field_08: number
	address_field_09: boolean
	address_field_10: string | null
	address_field_11: number | null
}

export type ExternalCustomer = {
	id: string
	address: ExternalAddress | null
	default_intent: ExternalIntent | null
	payment_methods: { data: ExternalPaymentMethod[]; has_more: boolean }
	customer_field_00: string
	customer_field_01: number
	customer_field_02: boolean
	customer_field_03: string | null
	customer_field_04: number | null
	customer_field_05: 'automatic' | 'manual'
	customer_field_06: Record<string, string>
	customer_field_07: string
	customer_field_08: number
	customer_field_09: boolean
	customer_field_10: string | null
	customer_field_11: number | null
	customer_field_12: 'automatic' | 'manual'
	customer_field_13: Record<string, string>
	customer_field_14: string
	customer_field_15: number
	customer_field_16: boolean
	customer_field_17: string | null
	customer_field_18: number | null
	customer_field_19: 'automatic' | 'manual'
	customer_field_20: Record<string, string>
	customer_field_21: string
	customer_field_22: number
	customer_field_23: boolean
	customer_field_24: string | null
}

export type ExternalPaymentMethod = {
	id: string
	billing_details: { address: ExternalAddress; email: string | null; name: string | null }
	customer: string | ExternalCustomer | null
	card: { brand: string; exp_month: number; exp_year: number; checks: { cvc_check: string | null; address_line1_check: string | null } } | null
	method_field_00: string
	method_field_01: number
	method_field_02: boolean
	method_field_03: string | null
	method_field_04: number | null
	method_field_05: 'automatic' | 'manual'
	method_field_06: Record<string, string>
	method_field_07: string
	method_field_08: number
	method_field_09: boolean
	method_field_10: string | null
	method_field_11: number | null
	method_field_12: 'automatic' | 'manual'
	method_field_13: Record<string, string>
	method_field_14: string
	method_field_15: number
	method_field_16: boolean
	method_field_17: string | null
	method_field_18: number | null
	method_field_19: 'automatic' | 'manual'
	method_field_20: Record<string, string>
	method_field_21: string
	method_field_22: number
	method_field_23: boolean
	method_field_24: string | null
}

export type ExternalCharge = {
	id: string
	amount: number
	billing_details: { address: ExternalAddress }
	payment_intent: string | ExternalIntent | null
	payment_method_details: { card: { brand: string; network: string | null } | null } | null
	refunds: { data: { id: string; amount: number; charge: string | ExternalCharge }[] }
	charge_field_00: string
	charge_field_01: number
	charge_field_02: boolean
	charge_field_03: string | null
	charge_field_04: number | null
	charge_field_05: 'automatic' | 'manual'
	charge_field_06: Record<string, string>
	charge_field_07: string
	charge_field_08: number
	charge_field_09: boolean
	charge_field_10: string | null
	charge_field_11: number | null
	charge_field_12: 'automatic' | 'manual'
	charge_field_13: Record<string, string>
	charge_field_14: string
	charge_field_15: number
	charge_field_16: boolean
	charge_field_17: string | null
	charge_field_18: number | null
	charge_field_19: 'automatic' | 'manual'
	charge_field_20: Record<string, string>
	charge_field_21: string
	charge_field_22: number
	charge_field_23: boolean
	charge_field_24: string | null
	charge_field_25: number | null
	charge_field_26: 'automatic' | 'manual'
	charge_field_27: Record<string, string>
	charge_field_28: string
	charge_field_29: number
}

export type ExternalIntent = {
	id: string
	amount: number
	currency: string
	customer: string | ExternalCustomer | null
	payment_method: string | ExternalPaymentMethod | null
	last_payment_error: { code: string; message: string; payment_method: ExternalPaymentMethod | null; charge: ExternalCharge | null } | null
	charges: { data: ExternalCharge[]; has_more: boolean }
	shipping: { address: ExternalAddress; name: string; carrier: string | null } | null
	next_action: { type: string; redirect_to_url: { url: string; return_url: string } | null } | null
	metadata: Record<string, string>
	intent_field_00: string
	intent_field_01: number
	intent_field_02: boolean
	intent_field_03: string | null
	intent_field_04: number | null
	intent_field_05: 'automatic' | 'manual'
	intent_field_06: Record<string, string>
	intent_field_07: string
	intent_field_08: number
	intent_field_09: boolean
	intent_field_10: string | null
	intent_field_11: number | null
	intent_field_12: 'automatic' | 'manual'
	intent_field_13: Record<string, string>
	intent_field_14: string
	intent_field_15: number
	intent_field_16: boolean
	intent_field_17: string | null
	intent_field_18: number | null
	intent_field_19: 'automatic' | 'manual'
	intent_field_20: Record<string, string>
	intent_field_21: string
	intent_field_22: number
	intent_field_23: boolean
	intent_field_24: string | null
	intent_field_25: number | null
	intent_field_26: 'automatic' | 'manual'
	intent_field_27: Record<string, string>
	intent_field_28: string
	intent_field_29: number
	intent_field_30: boolean
	intent_field_31: string | null
	intent_field_32: number | null
	intent_field_33: 'automatic' | 'manual'
	intent_field_34: Record<string, string>
	intent_field_35: string
	intent_field_36: number
	intent_field_37: boolean
	intent_field_38: string | null
	intent_field_39: number | null
	intent_field_40: 'automatic' | 'manual'
	intent_field_41: Record<string, string>
	intent_field_42: string
	intent_field_43: number
	intent_field_44: boolean
	intent_field_45: string | null
	intent_field_46: number | null
	intent_field_47: 'automatic' | 'manual'
	intent_field_48: Record<string, string>
	intent_field_49: string
	intent_field_50: number
	intent_field_51: boolean
	intent_field_52: string | null
	intent_field_53: number | null
	intent_field_54: 'automatic' | 'manual'
	intent_field_55: Record<string, string>
	intent_field_56: string
	intent_field_57: number
	intent_field_58: boolean
	intent_field_59: string | null
	intent_field_60: number | null
	intent_field_61: 'automatic' | 'manual'
	intent_field_62: Record<string, string>
	intent_field_63: string
	intent_field_64: number
	intent_field_65: boolean
	intent_field_66: string | null
	intent_field_67: number | null
	intent_field_68: 'automatic' | 'manual'
	intent_field_69: Record<string, string>
	intent_field_70: string
	intent_field_71: number
	intent_field_72: boolean
	intent_field_73: string | null
	intent_field_74: number | null
	intent_field_75: 'automatic' | 'manual'
	intent_field_76: Record<string, string>
	intent_field_77: string
	intent_field_78: number
	intent_field_79: boolean
	intent_field_80: string | null
	intent_field_81: number | null
	intent_field_82: 'automatic' | 'manual'
	intent_field_83: Record<string, string>
	intent_field_84: string
	intent_field_85: number
	intent_field_86: boolean
	intent_field_87: string | null
	intent_field_88: number | null
	intent_field_89: 'automatic' | 'manual'
}
