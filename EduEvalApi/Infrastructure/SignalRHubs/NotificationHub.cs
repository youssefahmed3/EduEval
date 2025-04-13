using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
namespace Infrastructure.SignalRHubs;
public class NotificationHub : Hub
{
/*     public override Task OnConnectedAsync()
    {
        Console.WriteLine("Client connected to TestHub.");
        return base.OnConnectedAsync();
    } */

    public override async Task OnConnectedAsync()
    {
        var user = Context.User;
        if (user?.Identity?.IsAuthenticated == true)
        {
            var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = user.FindFirst(ClaimTypes.Role)?.Value;
            
            if (userRole == "Admin")
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "AdminGroup");
                Console.WriteLine($"Admin {userId} connected: {Context.ConnectionId}");
            }
            
            Console.WriteLine($"User {userId} connected with role {userRole}");
        }
        await base.OnConnectedAsync();
    }

    public async Task JoinGroup(string groupName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        await Clients.Group(groupName).SendAsync("GroupJoined", $"{Context.ConnectionId} has joined the group {groupName}.");
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        // await Groups.RemoveFromGroupAsync(Context.ConnectionId, "AdminGroup");
        await base.OnDisconnectedAsync(exception);
    }
}