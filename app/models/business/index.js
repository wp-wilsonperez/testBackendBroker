
import mongoose from 'mongoose';

let BusinessSchema = new mongoose.Schema({
	ruc: {type: String, require: true, unique : true},
	name: {type: String, require: true},
	userMaster: {type: String, require: true},
	password: {type: String, require: true},
	phone: {type: String, require: true},
	movil: {type: String, require: true},
	address: {type: String, require: true},
	businessImg: {type: String, require: true},
	description: {type: String, require: true},
	constitutionDate: {type: Date, require: true},
	parking: {type: Boolean, require: true},
	numberEmp: {type: Number, require: true},
	mail: {type: String, require: true},
	web: {type: String, require: true},
	Enabled: {type: String, require: true},
	Actived: {type: String, require: true},
	idLicense: {type: String, require: true},
	nameBBDD: {type: String, require: true},
	schedule: [ {
			date_start: {type: Number, require: true},
			date_end: {type: Number, require: true},
			hours: {
				start: {type: String, require: true},
				end: {type: String, require: true},
			}
		}
	],
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});

export default mongoose.model('Business', BusinessSchema)
