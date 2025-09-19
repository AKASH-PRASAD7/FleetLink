import AppLayout from '../AppLayout';

export default function AppLayoutExample() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <p className="text-muted-foreground">
            This is the main application layout with navigation, header, and footer.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Sample Content Area 1</h3>
            <p className="text-sm text-muted-foreground">
              Content would go here. The layout provides consistent spacing and navigation.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Sample Content Area 2</h3>
            <p className="text-sm text-muted-foreground">
              More content here. Notice the responsive grid layout.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}