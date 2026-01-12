# Google Auth Development

This document tracks the development of the Google Login/Register functionality.

## Description

The goal is to allow users to sign in and register using their Google account via Supabase.

## Tasks

- [ ] Analyze existing Auth implementation
  - [x] Read `LoginForm.tsx`
  - [x] Read `LoginPage.tsx`
  - [x] Read `useAuth.ts` and `authService.ts` (Found `useAuth` uses context)
    - [x] Read `AuthContext` and `AuthProvider` (Confirmed `signInWithGoogle` is ALREADY implemented)
    - [x] Find Supabase client initialization
- [x] Implement `signInWithGoogle` in Auth Service/Hook
  - [x] Modify `AuthContext` to include `signInWithGoogle` ((Already present))
  - [x] Implement `signInWithGoogle` in `AuthProvider` (Already present)
- [x] Add Google Sign-In UI to `LoginForm`
  - [x] Add Google Icon (SVG)
  - [x] Create a Divider component
  - [x] Add "Sign in with Google" button
  - [x] Handle button click
- [ ] Verify functionality
  - [ ] **User Action Required**: Ensure `[origin]/app` is added to Redirect URLs in Supabase.
  - [ ] Test login and register flows.
