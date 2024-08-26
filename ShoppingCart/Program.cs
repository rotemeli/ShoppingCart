using ShoppingCart.Services;
using ShoppingCart.Data;

var builder = WebApplication.CreateBuilder(args);

// Configure MongoDBSettings from the configuration file
builder.Services.Configure<MongoDBSettings>(builder.Configuration.GetSection("MongoDBSettings"));

// Register MongoDBContext as a singleton
builder.Services.AddSingleton<MongoDBContext>();

// Register CartService as a scoped service
builder.Services.AddScoped<CartService>();
builder.Services.AddScoped<ProductService>();

// Add services to the container.

builder.Services.AddControllers();

// Configure CORS with a specific policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors("AllowSpecificOrigin");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
