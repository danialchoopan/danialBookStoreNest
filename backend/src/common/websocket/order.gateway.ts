/**
 * WebSocket Gateway - Live order status updates
 *
 * Clients connect with their userId and receive real-time
 * order status notifications when their orders change.
 *
 * Events:
 *   client → server: "join" (userId)
 *   server → client: "orderUpdate" { orderId, status, statusLabel }
 */

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>(); // userId → socketId

  handleConnection(client: Socket) {
    console.log(`🔌 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // Remove from userSockets
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
    console.log(`🔌 Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() userId: string) {
    this.userSockets.set(userId, client.id);
    client.join(`user:${userId}`);
    console.log(`👤 User ${userId} joined`);
  }

  // Called by services when order status changes
  notifyOrderUpdate(userId: string, orderId: string, status: string, statusLabel: string) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('orderUpdate', {
        orderId,
        status,
        statusLabel,
        timestamp: new Date().toISOString(),
      });
    }

    // Also broadcast to user's room
    this.server.to(`user:${userId}`).emit('orderUpdate', {
      orderId,
      status,
      statusLabel,
      timestamp: new Date().toISOString(),
    });
  }
}
