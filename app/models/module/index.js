
import mongoose from 'mongoose';

let ModuleSchema = new mongoose.Schema({
	name: {type: String, require: true},
	description: {type: String, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: Number, require: true},
	dateUpdate: {type: String, require: true},
	userUpdate: {type: Number, require: true}
});

export default mongoose.model('Module', ModuleSchema)
