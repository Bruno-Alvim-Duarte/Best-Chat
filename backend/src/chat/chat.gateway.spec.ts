import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';

describe('ChatGateway', () => {
  let gateway: ChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
    if (gateway.server) {
      gateway.server.close();
    }
  })

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should emit the message for all clients', () => {
    const message = 'Hello, World!';
    gateway.server = { emit: jest.fn(), close: jest.fn() } as any;
    const emitSpy = jest.spyOn(gateway.server, 'emit');

    gateway.handleMessage(message);

    expect(emitSpy).toHaveBeenCalledWith('message', message);
  })
});
