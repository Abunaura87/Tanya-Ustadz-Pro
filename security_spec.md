# Security Specification — Tanya Ustadz Pro

## 1. Data Invariants
1. **Strict Ownership (`userId == request.auth.uid`)**: A `Consultation` document in `/consultations/{consultationId}` can only be created, read (`get`/`list`), or deleted by the authenticated, email-verified user whose `uid` matches `userId`.
2. **Verified Identity**: All reads and writes require `request.auth != null && request.auth.token.email_verified == true`.
3. **Immutable Historical Record**: Once a consultation record is saved in `/consultations/{consultationId}`, it cannot be mutated (`allow update: if false;`), preventing update-gap tampering.
4. **Strict Volumetric & Key Bounds**: `hasAll` and `hasOnly` enforce exact keys, string lengths (`question <= 2000`, `ringkasanInti <= 5000`), bounded array sizes (`selectedSources.size() <= 10`, `daftarDalil.size() <= 15`, `analisisIstinbath.size() <= 15`), and server timestamp (`createdAt == request.time`).

## 2. The "Dirty Dozen" Payloads
1. **Unauthenticated Write**: `auth = null` attempting `create` on `/consultations/c1` -> `PERMISSION_DENIED`.
2. **Unverified Email Spoof**: `auth = { uid: 'u1', token: { email_verified: false } }` attempting `create` -> `PERMISSION_DENIED`.
3. **Identity Spoofing**: `auth.uid = 'u1'`, payload `userId: 'u2'` -> `PERMISSION_DENIED`.
4. **Shadow Field Injection**: Payload includes `isAdmin: true` -> Rejected by `hasOnly()`.
5. **Missing Required Key**: Payload omits `daftarDalil` -> Rejected by `hasAll()`.
6. **Oversized Question DoW**: `question` length 50,000 chars -> Rejected by `question.size() <= 2000`.
7. **ID Poisoning**: Document ID contains spaces or >128 chars -> Rejected by `isValidId(consultationId)`.
8. **Empty/Untyped Array**: `selectedSources: []` or `[123]` -> Rejected by `selectedSources.size() >= 1 && selectedSources[0] is string`.
9. **Client Timestamp Forgery**: `createdAt` set to past/future timestamp (`!= request.time`) -> `PERMISSION_DENIED`.
10. **Cross-Tenant Read (`get`)**: User `u2` reading `/consultations/c1` owned by `u1` -> `PERMISSION_DENIED`.
11. **Unscoped List Query**: User `u1` listing `/consultations` without `where('userId', '==', 'u1')` -> Rejected by `resource.data.userId == request.auth.uid`.
12. **Unauthorized Mutation (`update`)**: Owner attempting to modify `ringkasanInti` after creation -> Rejected by `allow update: if false;`.
