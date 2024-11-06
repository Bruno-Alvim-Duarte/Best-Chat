import { JwtAuthGuard } from './auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('JwtAuthGuard', () => {
  let jwtAuthGuard: JwtAuthGuard;
  let jwtService: JwtService;
  let context: ExecutionContext;

  const mockRequest = (token: string | null) => ({
    cookies: { jwt: token },

  });

  const mockExecutionContext = (request: any) => ({
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext);

  beforeEach(() => {
    jwtService = new JwtService({ secret: process.env.JWT_SECRET });
    jwtAuthGuard = new JwtAuthGuard(jwtService);
  });

  it('should throw UnauthorizedException if token is not found', () => {
    const request = mockRequest(null);
    context = mockExecutionContext(request);

    expect(() => jwtAuthGuard.canActivate(context)).toThrowError(
      new UnauthorizedException('Token not found')
    );
  });

  it('should throw UnauthorizedException if token is invalid', () => {
    const request = mockRequest('invalid-token');
    context = mockExecutionContext(request);

    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    expect(() => jwtAuthGuard.canActivate(context)).toThrowError(
      new UnauthorizedException('Invalid token')
    );
  });

  it('should allow access if token is valid', () => {
    const request = mockRequest('valid-token') as any;
    context = mockExecutionContext(request);

    const payload = { id: 1, name: 'John Doe', email: 'johndoe@gmail.com', active: true };
    jest.spyOn(jwtService, 'verify').mockReturnValue(payload);

    const result = jwtAuthGuard.canActivate(context);

    expect(result).toBe(true);
    expect(request.user).toEqual(payload); 
  });
});
