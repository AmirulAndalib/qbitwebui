import { describe, it, expect } from 'vitest'
import { extractQbtSessionToken } from '../../src/server/routes/proxy'

describe('extractQbtSessionToken', () => {
    describe('qBittorrent cookie formats', () => {
        it('extracts value from legacy SID cookie (qBittorrent < 5.2)', () => {
            expect(extractQbtSessionToken('SID=abc123')).toBe('abc123')
        })

        it('extracts value from QBT_SID_8081 cookie (qBittorrent 5.2.x, port 8081)', () => {
            expect(extractQbtSessionToken('QBT_SID_8081=abc123')).toBe('abc123')
        })

        it('extracts value from QBT_SID_443 cookie (qBittorrent 5.2.x, port 443)', () => {
            expect(extractQbtSessionToken('QBT_SID_443=abc123')).toBe('abc123')
        })

        it('extracts value from arbitrary high port QBT_SID cookie', () => {
            expect(extractQbtSessionToken('QBT_SID_12345=abc123')).toBe('abc123')
        })
    })

    describe('full Set-Cookie value', () => {
        it('strips attributes after the first semicolon', () => {
            expect(extractQbtSessionToken('QBT_SID_8081=abc123; Path=/; HttpOnly')).toBe('abc123')
        })

        it('strips attributes for legacy SID cookie', () => {
            expect(extractQbtSessionToken('SID=abc123; Path=/; HttpOnly')).toBe('abc123')
        })
    })

    describe('cookie name validation', () => {
        it('rejects a cookie whose name does not contain SID', () => {
            expect(extractQbtSessionToken('theme=dark')).toBe('')
        })

        it('picks the SID cookie out of multiple cookies', () => {
            expect(extractQbtSessionToken('theme=dark; SID=abc123; lang=en')).toBe('abc123')
        })

        it('picks the QBT_SID cookie out of multiple cookies', () => {
            expect(extractQbtSessionToken('theme=dark; QBT_SID_8081=abc123')).toBe('abc123')
        })

        it('does not match lowercase sid in another cookie name', () => {
            expect(extractQbtSessionToken('resident=user; theme=dark')).toBe('')
        })
    })

    describe('value edge cases', () => {
        it('preserves equals signs inside the session value', () => {
            expect(extractQbtSessionToken('SID=abc==def')).toBe('abc==def')
        })

        it('handles values that look like base64 padding', () => {
            expect(extractQbtSessionToken('QBT_SID_8081=YWJj==')).toBe('YWJj==')
        })
    })

    describe('invalid input', () => {
        it('returns empty string for null', () => {
            expect(extractQbtSessionToken(null)).toBe('')
        })

        it('returns empty string for undefined', () => {
            expect(extractQbtSessionToken(undefined)).toBe('')
        })

        it('returns empty string for empty string', () => {
            expect(extractQbtSessionToken('')).toBe('')
        })

        it('returns empty string when no equals sign is present', () => {
            expect(extractQbtSessionToken('malformed-cookie')).toBe('')
        })
    })
})
