export function isNotNullish(val: unknown): val is Record<string, unknown> {
  return val != null
}

export function messengerCreator<
  MessageUnion extends {
    type: string
    request?: Record<string, unknown>
    response?: Record<string, unknown>
  },
>() {
  type MessageByType<Type extends MessageUnion['type']> =
    & { type: Type }
    & MessageUnion
  return {
    createSender<Option extends Record<string, unknown>>(
      rawSender: (
        type: string,
        rawMessage: string,
        option?: Option,
      ) => Promise<string | void> | string | void,
    ) {
      return async function sender<
        Type extends MessageUnion['type'],
        Message extends ({ type: Type } & MessageUnion),
      >(
        type: Type,
        request: Message['request'],
        option?: Option,
      ): Promise<Message['response']> {
        const rawMessage = JSON.stringify({ type, request })
        return JSON.parse(await rawSender(type, rawMessage, option) ?? 'null')
      }
    },
    createListener(
      rawListener: (
        listener:
          & ((
            type: MessageUnion['type'],
            rawMessage: string,
          ) => MessageUnion['response'])
          & ((rawMessage: string) => MessageUnion['response']),
      ) => void,
    ) {
      return function listener(
        handlers: {
          [type in MessageUnion['type']]: (
            request: MessageByType<type>['request'],
          ) => MessageByType<type>['response']
        },
      ) {
        rawListener(
          (
            typeOrRawMessage: MessageUnion['type'] | string,
            rawMessageOrUndefined?: string | undefined,
          ) => {
            const [type, request] = (() => {
              if (isNotNullish(rawMessageOrUndefined)) {
                const message = JSON.parse(rawMessageOrUndefined)
                return [typeOrRawMessage, message.request]
              } else {
                const message = JSON.parse(typeOrRawMessage)
                return [message.type, message.request]
              }
            })()
            return handlers[type as MessageUnion['type']](request)
          },
        )
      }
    },
  }
}
