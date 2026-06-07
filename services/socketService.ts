import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(userId?: number) {
    if (this.socket?.connected) {
      return this.socket;
    }

    const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001';
    
    this.socket = io(backendUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected to server');
      this.isConnected = true;
      
      // Join user-specific room if userId is provided
      if (userId) {
        this.socket?.emit('join-user-room', userId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('[Socket] Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }

  onLiveClassScheduled(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('live-class-scheduled', callback);
    }
  }

  offLiveClassScheduled(callback?: (data: any) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off('live-class-scheduled', callback);
      } else {
        this.socket.off('live-class-scheduled');
      }
    }
  }

  onCourseCreated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('course-created', callback);
    }
  }

  offCourseCreated(callback?: (data: any) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off('course-created', callback);
      } else {
        this.socket.off('course-created');
      }
    }
  }

  onCourseUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('course-updated', callback);
    }
  }

  offCourseUpdated(callback?: (data: any) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off('course-updated', callback);
      } else {
        this.socket.off('course-updated');
      }
    }
  }

  onCourseDeleted(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('course-deleted', callback);
    }
  }

  offCourseDeleted(callback?: (data: any) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off('course-deleted', callback);
      } else {
        this.socket.off('course-deleted');
      }
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
