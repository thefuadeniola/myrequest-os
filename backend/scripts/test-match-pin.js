import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcrypt';

const run = async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);

  const roomSchema = new mongoose.Schema({
    name: String,
    pin: String
  });

  roomSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.pin = await bcrypt.hash(this.pin, salt);
    next();
  });

  roomSchema.methods.matchPin = async function (enteredPin) {
    return bcrypt.compare(enteredPin, this.pin);
  }

  const Room = mongoose.model('RoomTest', roomSchema);

  const r = new Room({ name: 'T', pin: '1234' });
  await r.save();

  const fresh = await Room.findById(r._id);
  console.log('hashed pin length', fresh.pin.length);
  const ok = await fresh.matchPin('1234');
  console.log('match 1234 =>', ok);
  const ok2 = await fresh.matchPin('9999');
  console.log('match 9999 =>', ok2);

  await mongoose.disconnect();
  await mongod.stop();
}

run().catch(e=>{console.error(e);process.exit(1)});
