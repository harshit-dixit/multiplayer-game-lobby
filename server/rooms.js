const rooms = new Map();

rooms.findRoomByPlayer = (playerId) => {
  for (const [roomCode, room] of rooms.entries()) {
    if (room.players.some((p) => p.id === playerId)) {
      return roomCode;
    }
  }
  return null;
};

module.exports = rooms;
