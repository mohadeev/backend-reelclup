const desconnectFromRoom = (io, socket, rooms) => {
  socket.on("disconnect", (data) => {
    rooms.map(({ viewers, socketId }) => {
      const findIndexLeaver = viewers.findIndex(
        (useeer) => useeer.socketId === socket.id
      );
      if (findIndexLeaver >= 0) {
        var address = socket.handshake.address;
        console.log(
          "New connection from " + address.address + ":" + address.port
        );
        viewers.splice(findIndexLeaver, 1);
        socket.to(socketId).emit("watcher-leave", {
          viewers,
        });
        viewers.map(({ socketId }) => {
          socket.to(socketId).emit("new-watcher-joined", viewers.length);
          io.to(socketId).emit("new-watcher-joined", viewers.length);
        });
      }
      viewers.map(({ socketId }) => {
        if (socket.id === socketId) {
          console.log(socketId, socket.id);
        }
      });
    });
  });
};

export default desconnectFromRoom;
