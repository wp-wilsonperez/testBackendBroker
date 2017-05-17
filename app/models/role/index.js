
import mongoose from 'mongoose';

let RoleSchema = new mongoose.Schema({
	name: {type: String, require: true},
	description: {type: String},
	grant: {type: String, default: ''},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});

export default mongoose.model('Role', RoleSchema)
