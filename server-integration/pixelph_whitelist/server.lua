local API_BASE = GetConvar('pixelph_whitelist_api', 'https://pixelph.com/api/whitelist')
local API_KEY = GetConvar('pixelph_whitelist_key', '')
local FAIL_OPEN = GetConvarInt('pixelph_whitelist_fail_open', 0) == 1

local function getDiscordId(src)
    for _, identifier in ipairs(GetPlayerIdentifiers(src)) do
        if identifier:sub(1, 8) == 'discord:' then
            return identifier:sub(9)
        end
    end
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

    PerformHttpRequest(('%s/%s'):format(API_BASE, discordId), function(status, body)
        if status ~= 200 then
            if FAIL_OPEN then deferrals.done() else deferrals.done('Whitelist service is temporarily unavailable. Please try again shortly.') end
            return
        end
        local ok, data = pcall(json.decode, body or '')
        if not ok or type(data) ~= 'table' then
            if FAIL_OPEN then deferrals.done() else deferrals.done('Whitelist verification failed. Please try again.') end
            return
        end
        if data.approved then
            deferrals.done()
        elseif data.status == 'pending' then
            deferrals.done('Your PixelPH whitelist application is still under review.')
        elseif data.status == 'rejected' then
            deferrals.done('Your PixelPH whitelist application was not approved. Check the website/Discord for the review result.')
        else
            deferrals.done('PixelPH is whitelisted. Apply first at https://pixelph.com/pages/whitelist.html')
        end
    end, 'GET', '', { ['Authorization'] = 'Bearer ' .. API_KEY, ['Accept'] = 'application/json' })
end)
