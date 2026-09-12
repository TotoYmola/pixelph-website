local API_BASE = GetConvar('pixelph_whitelist_api', 'https://pixelph.com/api/whitelist')
local API_KEY = GetConvar('pixelph_whitelist_key', '')
local FAIL_OPEN = GetConvarInt('pixelph_whitelist_fail_open', 0) == 1
local DEBUG = GetConvarInt('pixelph_whitelist_debug', 0) == 1

local function getDiscordId(src)
    for _, identifier in ipairs(GetPlayerIdentifiers(src)) do
        if identifier:sub(1, 8) == 'discord:' then
            return identifier:sub(9)
        end
    end
end

local function urlEncode(str)
    if not str then return '' end
    str = tostring(str)
    str = str:gsub('\n', '\r\n')
    str = str:gsub('([^%w%-_%.~])', function(c)
        return string.format('%%%02X', string.byte(c))
    end)
    return str
end

AddEventHandler('playerConnecting', function(name, setKickReason, deferrals)
    local src = source
    deferrals.defer()
    Wait(0)
    deferrals.update('PixelPH: Checking whitelist approval...')

    local discordId = getDiscordId(src)
    if not discordId then
        deferrals.done('PixelPH whitelist requires Discord. Please open Discord, join the PixelPH server, then reconnect.')
        return
    end

    if API_KEY == '' then
        deferrals.done('PixelPH whitelist is not configured. Please contact staff.')
        return
    end

    local url = ('%s?discord_id=%s'):format(API_BASE, urlEncode(discordId))

    PerformHttpRequest(url, function(status, body)
        if DEBUG then
            print(('[pixelph_whitelist] Discord %s -> HTTP %s | %s'):format(discordId, tostring(status), tostring(body or '')))
        end

        if status ~= 200 then
            if FAIL_OPEN then
                deferrals.done()
            else
                deferrals.done(('Whitelist service is temporarily unavailable. Please try again shortly. (HTTP %s)'):format(tostring(status)))
            end
            return
        end

        local ok, data = pcall(json.decode, body or '')
        if not ok or type(data) ~= 'table' then
            if FAIL_OPEN then
                deferrals.done()
            else
                deferrals.done('Whitelist verification failed. Please try again.')
            end
            return
        end

        if data.approved then
            deferrals.done()
        elseif data.status == 'pending' then
            deferrals.done('Your PixelPH whitelist application is still under review.')
        elseif data.status == 'rejected' then
            local reason = data.review_reason and tostring(data.review_reason) or ''
            if reason ~= '' then
                deferrals.done('Your PixelPH whitelist application was rejected. Reason: ' .. reason)
            else
                deferrals.done('Your PixelPH whitelist application was not approved. Check the website/Discord for the review result.')
            end
        else
            deferrals.done('PixelPH is whitelisted. Apply first at https://pixelph.com/pages/whitelist.html')
        end
    end, 'GET', '', {
        ['Authorization'] = 'Bearer ' .. API_KEY,
        ['Accept'] = 'application/json'
    })
end)
