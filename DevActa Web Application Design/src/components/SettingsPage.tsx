import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useTheme } from "../contexts/ThemeContext";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: "light", name: "Light", preview: "bg-white text-gray-900", description: "Clean and bright" },
    { id: "dark", name: "Dark", preview: "bg-gray-900 text-white", description: "Easy on the eyes" },
    { id: "pink", name: "Pink", preview: "bg-pink-100 text-pink-900", description: "Soft and warm" },
    { id: "blue", name: "Blue", preview: "bg-blue-100 text-blue-900", description: "Professional and calm" },
    { id: "black", name: "Black", preview: "bg-black text-white", description: "Pure darkness" },
    { id: "green", name: "Green", preview: "bg-green-100 text-green-900", description: "Nature inspired" },
    { id: "purple", name: "Purple", preview: "bg-purple-100 text-purple-900", description: "Creative and bold" },
    { id: "orange", name: "Orange", preview: "bg-orange-100 text-orange-900", description: "Energetic and vibrant" }
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your DevArena experience</p>
        </div>

        {/* Theme Settings */}
        <Card className="p-6 bg-card">
          <div className="mb-6">
            <h2 className="text-xl mb-2">Appearance</h2>
            <p className="text-muted-foreground">Choose a theme that matches your style</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {themes.map((themeOption) => (
              <div
                key={themeOption.id}
                className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                  theme === themeOption.id ? "border-primary" : "border-border hover:border-muted-foreground"
                }`}
                onClick={() => setTheme(themeOption.id as any)}
              >
                <div className={`rounded-t-lg h-20 ${themeOption.preview} flex items-center justify-center`}>
                  <div className="text-sm">Preview</div>
                </div>
                <div className="p-3">
                  <h4 className="mb-1">{themeOption.name}</h4>
                  <p className="text-xs text-muted-foreground">{themeOption.description}</p>
                </div>
                {theme === themeOption.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Account Settings */}
        <Card className="p-6 bg-card mt-6">
          <div className="mb-6">
            <h2 className="text-xl mb-2">Account</h2>
            <p className="text-muted-foreground">Manage your account preferences</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="mb-1">GitHub Connection</h4>
                <p className="text-sm text-muted-foreground">Connected to your GitHub account</p>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="mb-1">Email Notifications</h4>
                <p className="text-sm text-muted-foreground">Receive updates about reviews and challenges</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="mb-1">Privacy Settings</h4>
                <p className="text-sm text-muted-foreground">Control who can see your profile and projects</p>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          </div>
        </Card>

        {/* About */}
        <Card className="p-6 bg-card mt-6">
          <div className="mb-6">
            <h2 className="text-xl mb-2">About DevArena</h2>
            <p className="text-muted-foreground">Application information and resources</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl mb-2">📖</div>
              <h4 className="mb-1">Documentation</h4>
              <p className="text-sm text-muted-foreground">Learn how to use DevArena</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🐛</div>
              <h4 className="mb-1">Report Bug</h4>
              <p className="text-sm text-muted-foreground">Help us improve the platform</p>
            </div>
            <div>
              <div className="text-2xl mb-2">💬</div>
              <h4 className="mb-1">Feedback</h4>
              <p className="text-sm text-muted-foreground">Share your thoughts and ideas</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}