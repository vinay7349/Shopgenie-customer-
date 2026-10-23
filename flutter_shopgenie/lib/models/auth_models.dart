/// Typed model for an authenticated user returned by the backend.
class AuthUser {
  final String id;
  final String username;
  final String email;
  final String role;

  const AuthUser({
    required this.id,
    required this.username,
    required this.email,
    required this.role,
  });

  factory AuthUser.fromJson(Map<String, dynamic> json) {
    final id = json['id']?.toString();
    final username = json['username']?.toString();
    final email = json['email']?.toString();
    final role = json['role']?.toString();

    if (id == null || id.isEmpty) {
      throw const FormatException('AuthUser.id is required');
    }
    if (username == null || username.isEmpty) {
      throw const FormatException('AuthUser.username is required');
    }
    if (email == null || email.isEmpty) {
      throw const FormatException('AuthUser.email is required');
    }
    if (role == null || role.isEmpty) {
      throw const FormatException('AuthUser.role is required');
    }

    return AuthUser(
      id: id,
      username: username,
      email: email,
      role: role,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'username': username,
        'email': email,
        'role': role,
      };

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AuthUser &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          username == other.username &&
          email == other.email &&
          role == other.role;

  @override
  int get hashCode => Object.hash(id, username, email, role);

  @override
  String toString() => 'AuthUser(id: $id, username: $username, email: $email, role: $role)';
}

/// JWT token pair returned by the backend.
class AuthTokens {
  final String access;
  final String refresh;

  const AuthTokens({
    required this.access,
    required this.refresh,
  });

  factory AuthTokens.fromJson(Map<String, dynamic> json) {
    final access = json['access']?.toString();
    final refresh = json['refresh']?.toString();

    if (access == null || access.isEmpty) {
      throw const FormatException('AuthTokens.access is required');
    }
    if (refresh == null || refresh.isEmpty) {
      throw const FormatException('AuthTokens.refresh is required');
    }

    return AuthTokens(
      access: access,
      refresh: refresh,
    );
  }

  Map<String, dynamic> toJson() => {
        'access': access,
        'refresh': refresh,
      };

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AuthTokens &&
          runtimeType == other.runtimeType &&
          access == other.access &&
          refresh == other.refresh;

  @override
  int get hashCode => Object.hash(access, refresh);

  @override
  String toString() => 'AuthTokens(access: ${access.substring(0, 10)}..., refresh: ${refresh.substring(0, 10)}...)';
}

/// Combined response from login/registration endpoints.
class AuthResponse {
  final AuthTokens tokens;
  final AuthUser user;
  final AuthUser? shopOwner; // Only present in owner registration
  final Map<String, dynamic>? shop; // Only present in owner registration

  const AuthResponse({
    required this.tokens,
    required this.user,
    this.shopOwner,
    this.shop,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      tokens: AuthTokens.fromJson(json),
      user: AuthUser.fromJson(json['user'] as Map<String, dynamic>),
      shopOwner: json['shop_owner'] != null
          ? AuthUser.fromJson(json['shop_owner'] as Map<String, dynamic>)
          : null,
      shop: json['shop'] as Map<String, dynamic>?,
    );
  }

  Map<String, dynamic> toJson() => {
        ...tokens.toJson(),
        'user': user.toJson(),
        if (shopOwner != null) 'shop_owner': shopOwner!.toJson(),
        if (shop != null) 'shop': shop,
      };
}