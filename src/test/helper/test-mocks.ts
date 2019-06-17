import { EventEmitter } from 'events'
import { Message } from '../../constants'
import { JSONObject } from '../../../binary-protocol/src/message-constants'
import { SocketWrapper } from '../../types'
const sinon = require('sinon')

export const getTestMocks = () => {

  const subscriptionRegistry = {
    subscribe: () => {},
    unsubscribe: () => {},
    sendToSubscribers: () => {},
    setSubscriptionListener: () => {},
    getLocalSubscribers: () => {},
    getAllRemoteServers: () => {},
    setAction: () => {}
  }

  const listenerRegistry = {
    handle: () => {}
  }

  const emitter = new EventEmitter()
  const stateRegistry = {
    add: () => {},
    remove: () => {},
    on: () => {},
    emit: () => {},
    getAll: () => {},
    onAdd: () => {},
    onRemove: () => {}
  }
  stateRegistry.on = emitter.on as any
  stateRegistry.emit = emitter.emit as any

  const recordHandler = {
    broadcastUpdate: () => {},
    transitionComplete: () => {}
  }

  const subscriptionRegistryMock = sinon.mock(subscriptionRegistry)
  const listenerRegistryMock = sinon.mock(listenerRegistry)
  const stateRegistryMock = sinon.mock(stateRegistry)
  const recordHandlerMock = sinon.mock(recordHandler)

  function getSocketWrapper (user: string, authData: JSONObject = {}, clientData: JSONObject = {}) {
    const socketWrapperEmitter = new EventEmitter()
    const socketWrapper = {
      authAttempts: 0,
      user,
      authData,
      clientData,
      sendMessage: () => {},
      sendBinaryMessage: () => {},
      sendAckMessage: () => {},
      uuid: Math.random(),
      parseData: (message: Message) => {
        if (message.parsedData) {
          return true
        }
        try {
          message.parsedData = JSON.parse(message.data!.toString())
          return true
        } catch (e) {
          return e
        }
      },
      getMessage: (message: Message) => message,
      parseMessage: (message: Message) => message,
      destroy: () => {},
      getHandshakeData: () => ({}),
      close: () => {},
      onClose: () => {},
      removeOnClose: () => {},
      emit: socketWrapperEmitter.emit,
      on: socketWrapperEmitter.on,
      once: socketWrapperEmitter.once,
      removeListener: socketWrapperEmitter.removeListener,
    } as never as SocketWrapper

    return {
      socketWrapper,
      socketWrapperMock: sinon.mock(socketWrapper)
    }
  }

  return {
    subscriptionRegistry,
    listenerRegistry,
    stateRegistry,
    recordHandler,
    subscriptionRegistryMock,
    listenerRegistryMock,
    stateRegistryMock,
    recordHandlerMock,
    getSocketWrapper,
  }
}
