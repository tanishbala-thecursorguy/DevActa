import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { mockUsers } from "../data/mockData";

interface HiringPageProps {
  onPageChange: (page: string) => void;
}

export function HiringPage({ onPageChange }: HiringPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [trophyFilter, setTrophyFilter] = useState("all");

  const roles = [...new Set(mockUsers.map(user => user.role))];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesTrophies = trophyFilter === "all" || 
                           (trophyFilter === "100+" && user.trophies >= 100) ||
                           (trophyFilter === "200+" && user.trophies >= 200) ||
                           (trophyFilter === "300+" && user.trophies >= 300);
    
    return matchesSearch && matchesRole && matchesTrophies;
  }).sort((a, b) => b.trophies - a.trophies);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Hire Top Developers</h1>
          <p className="text-muted-foreground">Find skilled developers based on their proven track record and community reviews</p>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 bg-card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search by name or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={trophyFilter} onValueChange={setTrophyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Trophy level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="100+">100+ Trophies</SelectItem>
                  <SelectItem value="200+">200+ Trophies</SelectItem>
                  <SelectItem value="300+">300+ Trophies</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Button className="w-full bg-primary hover:bg-primary/90">
                Search
              </Button>
            </div>
          </div>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredUsers.length} developer{filteredUsers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Developer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="p-6 bg-card hover:shadow-md transition-shadow">
              <div className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-lg">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <h3 className="text-lg mb-2">{user.name}</h3>
                <Badge variant="secondary" className="mb-3">
                  {user.role}
                </Badge>
                
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="text-xl">🏆</span>
                  <span className="text-lg">{user.trophies}</span>
                  <span className="text-sm text-muted-foreground">trophies</span>
                </div>

                {/* Skills/Highlights */}
                <div className="mb-4 text-sm text-muted-foreground">
                  <p>Verified by community reviews</p>
                  <p>Top {Math.ceil((mockUsers.length - mockUsers.findIndex(u => u.id === user.id)) / mockUsers.length * 100)}% performer</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => onPageChange("profile")}
                  >
                    View Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open(user.github, '_blank')}
                  >
                    View GitHub
                  </Button>
                </div>

                {/* Contact */}
                <div className="mt-4 pt-4 border-t">
                  <Button variant="ghost" size="sm" className="w-full text-primary">
                    Contact Developer
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredUsers.length === 0 && (
          <Card className="p-12 bg-card text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl mb-2">No developers found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria or filters</p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("all");
                setTrophyFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </Card>
        )}

        {/* Hiring Information */}
        <Card className="p-8 bg-card mt-12">
          <div className="text-center">
            <h2 className="text-2xl mb-4">Why Hire Through DevArena?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl mb-3">🏆</div>
                <h4 className="mb-2">Proven Skills</h4>
                <p className="text-muted-foreground text-sm">All developers are ranked based on peer reviews and coding challenges</p>
              </div>
              <div>
                <div className="text-3xl mb-3">👥</div>
                <h4 className="mb-2">Community Verified</h4>
                <p className="text-muted-foreground text-sm">Real feedback from other developers who have reviewed their code</p>
              </div>
              <div>
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="mb-2">Pre-Vetted</h4>
                <p className="text-muted-foreground text-sm">Active portfolio of projects and contributions available for review</p>
              </div>
            </div>
            
            <div className="mt-8">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Post a Job
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}