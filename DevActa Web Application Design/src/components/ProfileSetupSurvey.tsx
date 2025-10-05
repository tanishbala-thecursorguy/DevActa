import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Plus, X } from "lucide-react";

interface UserProfile {
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
  profilePicture: string | null;
  githubLink: string;
  linkedinLink: string;
  otherSocials: string[];
}

interface ProfileSetupSurveyProps {
  onComplete: (profileData: UserProfile) => void;
  authUser?: any;
}

export function ProfileSetupSurvey({ onComplete, authUser }: ProfileSetupSurveyProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: authUser?.user_metadata?.user_name || authUser?.user_metadata?.preferred_username || "",
    firstName: authUser?.user_metadata?.full_name?.split(' ')[0] || "",
    lastName: authUser?.user_metadata?.full_name?.split(' ').slice(1).join(' ') || "",
    bio: authUser?.user_metadata?.bio || "",
    profilePicture: null as File | null,
    githubLink: authUser?.user_metadata?.html_url || `https://github.com/${authUser?.user_metadata?.user_name || ''}`,
    linkedinLink: "",
    otherSocials: [""],
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [profilePictureURL, setProfilePictureURL] = useState<string | null>(
    authUser?.user_metadata?.avatar_url || null
  );

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Show success animation
      setShowSuccess(true);
      
      // Prepare profile data
      const profileData: UserProfile = {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        profilePicture: profilePictureURL,
        githubLink: formData.githubLink,
        linkedinLink: formData.linkedinLink,
        otherSocials: formData.otherSocials.filter(s => s.trim() !== ""),
      };
      
      setTimeout(() => {
        onComplete(profileData);
      }, 3000);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addSocialLink = () => {
    setFormData({
      ...formData,
      otherSocials: [...formData.otherSocials, ""],
    });
  };

  const removeSocialLink = (index: number) => {
    const newSocials = formData.otherSocials.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      otherSocials: newSocials,
    });
  };

  const updateSocialLink = (index: number, value: string) => {
    const newSocials = [...formData.otherSocials];
    newSocials[index] = value;
    setFormData({
      ...formData,
      otherSocials: newSocials,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        profilePicture: file,
      });
      
      // Create a URL for the image to display
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePictureURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden professional-landing">
        {/* Professional Grid Background */}
        <div className="landing-grid-background"></div>
        
        {/* Gradient Overlay */}
        <div className="landing-gradient-overlay"></div>
        
        {/* Floating Dots Animation */}
        <div className="landing-dots-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="landing-dot"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
              }}
            />
          ))}
        </div>

        {/* Success Message */}
        <div className="text-center z-10">
          <div className="success-checkmark mb-8">
            <div className="w-32 h-32 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          </div>
          <h2 className="professional-title text-4xl mb-4 text-gray-900">Profile Created!</h2>
          <p className="professional-subtitle text-xl text-gray-600">Welcome to DevArena</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden professional-landing">
      {/* Professional Grid Background */}
      <div className="landing-grid-background"></div>
      
      {/* Gradient Overlay */}
      <div className="landing-gradient-overlay"></div>
      
      {/* Floating Dots Animation */}
      <div className="landing-dots-container">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="landing-dot"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6 py-12">
        
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            {[...Array(totalSteps)].map((_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    i + 1 === currentStep
                      ? 'bg-primary text-white shadow-lg transform scale-110'
                      : i + 1 < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500 border-2 border-gray-300'
                  }`}
                >
                  {i + 1 < currentStep ? '✓' : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 rounded transition-all duration-300 ${
                      i + 1 < currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-6 text-gray-600">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        {/* Survey Card */}
        <div className="professional-feature-card p-8 space-y-6 bg-white border-2">
          
          {/* Step 1: Username & Name */}
          {currentStep === 1 && (
            <div className="survey-step space-y-6">
              <h2 className="professional-title text-3xl text-center mb-8 text-gray-900">
                Let's Get Started
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-gray-700">Username</Label>
                  <Input
                    id="username"
                    placeholder="Choose a unique username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="professional-input mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="professional-input mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="professional-input mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Bio */}
          {currentStep === 2 && (
            <div className="survey-step space-y-6">
              <h2 className="professional-title text-3xl text-center mb-8 text-gray-900">
                Tell Us About Yourself
              </h2>
              
              <div>
                <Label htmlFor="bio" className="text-gray-700">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Passionate developer who loves building amazing things..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={6}
                  className="professional-input mt-2"
                />
                <p className="text-sm text-gray-600 mt-2">Tell the community about your skills and interests</p>
              </div>
            </div>
          )}

          {/* Step 3: Profile Picture */}
          {currentStep === 3 && (
            <div className="survey-step space-y-6">
              <h2 className="professional-title text-3xl text-center mb-8 text-gray-900">
                Add Your Photo
              </h2>
              
              <div className="text-center">
                <div className="max-w-sm mx-auto">
                  <input
                    type="file"
                    id="profilePic"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="profilePic"
                    className="block p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-blue-50 transition-all duration-300"
                  >
                    {formData.profilePicture ? (
                      <div className="text-center">
                        <div className="text-4xl mb-2 text-green-600">✓</div>
                        <div className="text-gray-700 font-medium">{formData.profilePicture.name}</div>
                        <div className="text-sm text-gray-500 mt-1">Click to change</div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <div className="text-gray-700 text-lg font-medium">Click to Upload Photo</div>
                        <div className="text-gray-500 text-sm mt-2">JPG, PNG or GIF (max 5MB)</div>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: GitHub & LinkedIn */}
          {currentStep === 4 && (
            <div className="survey-step space-y-6">
              <h2 className="professional-title text-3xl text-center mb-8 text-gray-900">
                Connect Your Profiles
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="github" className="text-gray-700 flex items-center space-x-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>GitHub Profile</span>
                  </Label>
                  <Input
                    id="github"
                    placeholder="https://github.com/username"
                    value={formData.githubLink}
                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                    className="professional-input mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedin" className="text-gray-700 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span>LinkedIn Profile</span>
                  </Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedinLink}
                    onChange={(e) => setFormData({ ...formData, linkedinLink: e.target.value })}
                    className="professional-input mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Other Socials */}
          {currentStep === 5 && (
            <div className="survey-step space-y-6">
              <h2 className="professional-title text-3xl text-center mb-8 text-gray-900">
                Other Social Links
              </h2>
              
              <div className="space-y-4">
                {formData.otherSocials.map((social, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder="https://..."
                      value={social}
                      onChange={(e) => updateSocialLink(index, e.target.value)}
                      className="professional-input flex-1"
                    />
                    {formData.otherSocials.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSocialLink(index)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addSocialLink}
                  className="w-full professional-button-secondary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Link
                </Button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200">
            <Button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="professional-button-secondary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Back
            </Button>

            <Button
              onClick={handleNext}
              className="professional-button-cta px-8"
            >
              {currentStep === totalSteps ? 'Finish' : 'Next →'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
